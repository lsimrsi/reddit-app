import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Spinner from './components/spinner';
import Post from './components/post';
import 'font-awesome/css/font-awesome.min.css';
import ThemeContext from './context';

function App() {
  const [srdata, setSrdata] = useState(null);
  const [subreddit, setSubreddit] = useState("");
  const [fetching, setFetching] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    fetchSubredditData("rust");
  }, []);

  useEffect(() => {
    if (!srdata) return;
    document.title = srdata.data.children[0].data.subreddit + ' posts';
  }, [srdata]);

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

    let jsonResponse = await res.json();
    if (!jsonResponse) return;
    if (!jsonResponse.data) return;

    setFetching(false);
    setSrdata(jsonResponse);
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
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="app">
        <header><h1>Reddit Client</h1><ThemeToggle /></header>
        <form onSubmit={onSubmit}>
          <input
            value={subreddit}
            placeholder="Search for a subreddit"
            onChange={onSubredditChange} />
        </form>
        {fetching && <Spinner />}
        {posts && posts}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

const ThemeToggle = () => {
  const ctx = useContext(ThemeContext);
  const toggleTheme = (newtheme) => {
    ctx.theme === 'default' ? ctx.setTheme('dark') : ctx.setTheme('default');
  }

  return (
    <button onClick={toggleTheme} className={ctx.theme}>Theme: {ctx.theme.charAt(0).toUpperCase() + ctx.theme.slice(1)}</button>
  );
}