import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="nf">
      <div className="nf__inner">
        <div className="nf__code">404</div>
        <div className="nf__rule" />
        <h1 className="nf__title">Page not found.</h1>
        <p className="nf__sub">
          This route doesn't exist. Unlike my grind streak.
        </p>
        <a href="/" className="nf__home">← Back to home</a>
      </div>
      <div className="nf__watermark">∅</div>
    </div>
  );
}