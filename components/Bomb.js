
export default function Bomb (props) {
  const name = props.name;
  let bombTimer = parseInt(props.bombTimer).toString().padStart(2, '0');
  const key = props.gridkey;
  return <div key={key} className={name.join(" ")} style={{ flexGrow: 0.1 }}>{bombTimer}</div>

}