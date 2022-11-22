use actix_files as fs;
use actix_web::{http, middleware, web, guard, App, Error, HttpResponse, HttpServer};
use futures::Future;
use reqwest::{self, Client};
use serde::Deserialize;
use std::env;

static BASE_URL: &str = "http://www.reddit.com/r/";
static RUST: &str = "http://www.reddit.com/r/rust.json";
static SLOWWLY: &str =
    "http://slowwly.robertomurray.co.uk/delay/5000/url/http://www.reddit.com/r/rust.json";

// User-Agent: windows:rust-reddit-app:v1.2.3 (by /u/rapiacct)

// generic method for sending off a request (get or post)
// and returns the response back to the front-end
fn send_request(
    builder: reqwest::RequestBuilder,
) -> impl Future<Item = HttpResponse, Error = Error> {
    println!("Request sent:\n\r{:#?}", builder);
    actix_web::web::block(move || builder.send())
        .from_err()
        .and_then(|mut res| match res.status() {
            reqwest::StatusCode::OK => match res.text() {
                Ok(body) => HttpResponse::Ok()
                    .content_type("application/json")
                    .body(body),
                Err(error) => {
                    println!("get text error: {}", error);
                    HttpResponse::InternalServerError()
                        .content_type("application/json")
                        .body(format!("{{\"error\": \"Error getting response text.\"}}"))
                }
            },
            _ => HttpResponse::InternalServerError()
                .content_type("application/json")
                .body(format!("{{\"error\": \"Couldn't get posts.\"}}")),
        })
}

// gets rust posts immediately
fn get_rust_posts(
    client: web::Data<Client>,
) -> impl Future<Item = HttpResponse, Error = actix_web::Error> {
    send_request(client.get(RUST))
}

// gets rust posts after a 5-second delay
fn get_rust_posts_slowwly(
    client: web::Data<Client>,
) -> impl Future<Item = HttpResponse, Error = actix_web::Error> {
    send_request(client.get(SLOWWLY))
}

// handles a variable in the requested path
fn get_subreddit_data(
    subreddit: web::Path<(String)>,
    client: web::Data<Client>,
) -> impl Future<Item = HttpResponse, Error = actix_web::Error> {
    let subreddit = format!("{}{}{}", BASE_URL, subreddit, ".json");
    send_request(client.get(&subreddit))
}

// struct for deserializing a json body sent by the front-end
#[derive(Deserialize)]
struct SubredditQuery {
    subreddit: String,
}

// handles post request with a json body
fn post_subreddit_data(
    srquery: web::Json<(SubredditQuery)>,
    client: web::Data<Client>,
) -> impl Future<Item = HttpResponse, Error = actix_web::Error> {
    let subreddit = format!("{}{}{}", BASE_URL, srquery.subreddit, ".json");
    send_request(client.post(&subreddit))
}

fn p404() -> Result<fs::NamedFile, Error> {
    Ok(fs::NamedFile::open("static/404.html")?.set_status_code(http::StatusCode::NOT_FOUND))
}

// if port is defined as an environment variable, use that instead
// for example, Heroku defines its own port
fn get_server_port() -> u16 {
    env::var("PORT")
        .unwrap_or_else(|_| "5000".to_string())
        .parse()
        .expect("PORT must be a number")
}

fn main() {
    println!("listening on: {}", get_server_port());
    HttpServer::new(|| {
        App::new()
            .data(Client::new())
            .wrap(middleware::Logger::default())
            .service(web::resource("/rust/posts").route(web::get().to_async(get_rust_posts)))
            .service(
                web::resource("/subreddit/data/{sr}")
                    .route(web::get().to_async(get_subreddit_data)),
            )
            .service(
                web::resource("/subreddit/data/").route(web::post().to_async(post_subreddit_data)),
            )
            .service(
                web::resource("/get/rust/posts/slowwly")
                    .route(web::get().to_async(get_rust_posts_slowwly)),
            )
            .service(fs::Files::new("/", "static/build").index_file("index.html"))
            .default_service(
                // 404 for GET request
                web::resource("")
                    .route(web::get().to(p404))
                    // all requests that are not GET
                    .route(
                        web::route()
                            .guard(guard::Not(guard::Get()))
                            .to(HttpResponse::MethodNotAllowed),
                    ),
            )
    })
    .bind(("0.0.0.0", get_server_port()))
    .unwrap()
    .run()
    .unwrap();
}
