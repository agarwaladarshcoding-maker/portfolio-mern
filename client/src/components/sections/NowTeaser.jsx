import { useState, useEffect } from "react";
import "./NowTeaser.css";

export default function NowTeaser() {
  var [data,    setData]    = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    fetch("/api/now")
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.success) setData(d.data); })
      .finally(function() { setLoading(false); });
  }, []);

  // Don't render if nothing filled in yet
  if (loading) return null;
  var hasContent = data && (
    (data.building && data.building.length) ||
    (data.learning && data.learning.length) ||
    data.thinking
  );
  if (!hasContent) return null;

  var firstBuilding = data.building && data.building[0];
  var firstLearning = data.learning && data.learning[0];

  return (
    <section className="now-teaser">
      <div className="container now-teaser__inner">

        <div className="now-teaser__left">
          <div className="now-teaser__eyebrow">
            <span className="now-teaser__pulse" />
            <span>Right now</span>
          </div>
          <div className="now-teaser__items">
            {firstBuilding && (
              <div className="now-teaser__item">
                <span className="now-teaser__item-label">Building</span>
                <span className="now-teaser__item-value">{firstBuilding.title}</span>
              </div>
            )}
            {firstLearning && (
              <div className="now-teaser__item">
                <span className="now-teaser__item-label">Learning</span>
                <span className="now-teaser__item-value">{firstLearning}</span>
              </div>
            )}
            {data.location && (
              <div className="now-teaser__item">
                <span className="now-teaser__item-label">Location</span>
                <span className="now-teaser__item-value">{data.location}</span>
              </div>
            )}
          </div>
        </div>

        <a href="/now" className="now-teaser__cta">
          <span className="now-teaser__cta-text">See full snapshot</span>
          <span className="now-teaser__cta-arrow">→</span>
        </a>

      </div>
    </section>
  );
}