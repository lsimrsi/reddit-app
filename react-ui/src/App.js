import React, { useState, useEffect } from 'react';
import './App.css';
import {Parser} from 'html-to-react';
import {XmlEntities} from 'html-entities';
import 'font-awesome/css/font-awesome.min.css';

var htmlToReactParser = new Parser();
var entities = new XmlEntities();

function App() {
  const [srdata, setSrdata] = useState(null);
  const [subreddit, setSubreddit] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchSubredditData("rust");
  }, []);

  useEffect(() => {
    if (!srdata) return;
    document.title = srdata.data.children[0].data.subreddit + ' posts';
  });

  const fetchSubredditData = async (subreddit) => {
    setFetching(true);
    setSrdata(null);

    let data = {
      subreddit,
    }

    let res = await fetch(`/subreddit/data/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res) return;

    let srdata = await res.json();
    if (!srdata) return;

    setFetching(false);
    setSrdata(srdata);
  }

  const onSubredditChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    setSubreddit(value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    fetchSubredditData(subreddit);
  }

  let posts = null;
  if (srdata && srdata.data) {
    posts = srdata.data.children.map((item, index) => {
      return <Post key={index.toString() + subreddit} item={item} />
    });
  }

  return (
    <div className="app">
      <header><h1>Reddit Client</h1></header>
      <form onSubmit={onSubmit}>
        <input
          value={subreddit}
          placeholder="Search for a subreddit"
          onChange={onSubredditChange} />
      </form>
      {fetching && <Spinner />}
      {posts && posts}
    </div>
  );
}

function Post(props) {
  const [clicked, setClicked] = useState(false);

  const onClick = () => {
    setClicked(!clicked);
  }

  const onLinkClick = (e) => {
    e.stopPropagation();
  }

  let hasContent = props.item.data.selftext_html ? true : false;

  let element = null;
  if (clicked && hasContent) {
    let decoded = entities.decode(props.item.data.selftext_html);
    element = htmlToReactParser.parse(decoded);
  }

  return (
    <section className="post">
      <p className="post-paragraph" onClick={onClick}>
        <div className="icon">
          {hasContent && <span className="fa fa-search" />}
        </div>
        <a className="icon fa fa-link" href={props.item.data.url} onClick={onLinkClick} target="_blank" rel="noopener noreferrer"></a>
        {props.item.data.title}
      </p>
      {clicked && element &&
      <div className="selftext">{element}</div>}
    </section>
  );
}

const Spinner = () =>
  <div className="spinner">
    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>;

export default App;
