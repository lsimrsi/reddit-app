import React, { useState, useEffect } from 'react';
import './App.css';

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

  let posts = [];
  if (srdata && srdata.data) {
    posts = srdata.data.children.map((item, index) => {
      return <Post key={index.toString() + subreddit} item={item} />
    });
  }

  return (
    <div className="app">
      <form onSubmit={onSubmit}>
        <input
          value={subreddit}
          placeholder="Enter subreddit"
          onChange={onSubredditChange} />
      </form>
      {fetching && <Spinner />}
      {posts.length && posts}
    </div>
  );
}

function Post(props) {
  const [clicked, setClicked] = useState(false);

  const onClick = () => {
    setClicked(!clicked);
  }

  return (
    <div className="post">
      <p onClick={onClick}>{props.item.data.title}</p>
      {clicked && props.item.data.selftext_html &&
        <div className="selftext">{props.item.data.selftext}</div>}
    </div>
  );
}

const Spinner = () =>
  <div className="spinner">
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>;

export default App;
