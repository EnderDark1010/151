export function Movie(props) {
  let title;
  let img;
  let text;
  if (props.title !== undefined)
    title = (
      <div>
        <a href={props.link} target="blank">
          {props.title}
        </a>
      </div>
    );
  if (props.text !== undefined) {
    let tempText = props.text.map((txt) => (
      <>
        {txt}
        <br />
      </>
    ));
    text = <div>{tempText}</div>;
  }

  if (props.img !== undefined) img = <img src={props.img} alt="" />;
  if (props.img !== undefined && props.link !== undefined)
    img = <a href={props.link} target="blank"></a>;

  return (
    <>
      <div>
        <div>{props.title}</div>
        {text}
        <div>
          <img src={props.img} className="movie_poster" alt="" />
          <img src={props.fsk} className="fsk" alt="" />
        </div>
      </div>
    </>
  );
}
