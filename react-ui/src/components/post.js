import React, { useState, useContext } from 'react';
import { XmlEntities } from 'html-entities';
import { Parser } from 'html-to-react';
import ThemeContext from '../context';
var htmlToReactParser = new Parser();

let entities = new XmlEntities();

export default function Post(props) {
  const [clicked, setClicked] = useState(false);
  const ctx = useContext(ThemeContext);

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
    <section className={`post ${ctx.theme}`}>
      <div className="post-paragraph" onClick={onClick}>
        <div className={`icon ${ctx.theme}`}>
          {hasContent && <span className="fa fa-search" />}
        </div>
        <a className={`icon ${ctx.theme}`} href={props.item.data.url} onClick={onLinkClick} target="_blank" rel="noopener noreferrer"><span className="fa fa-link"></span></a>
        {props.item.data.title}
      </div>
      {clicked && element &&
        <div className="selftext">{element}</div>}
    </section>
  );
}