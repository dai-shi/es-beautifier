const App = () => (<div><Hello/><span className="intro" style={{ color: 'red', fontSize: 'small' }}>This is JSX</span></div>);

const Hello = () => (<div style="display: block; background-color: red" className="hello world">World</div>);

const Hello2=()=>{const world='World';return (<div style="display: block; background-color: red" className="hello world">{world}</div>)};

const Hello3 = ({ index }) => { const data = [{ text: 'hello', style: { color: 'green' }, }, { text: 'world', style: { color: 'blue' }, }]; const getText = index => data[index].text; const getStyle = index => data[index].style; return (<div> <span style={getStyle(index)} className="loooooooooooooong">{getText(index)}</span> </div>); };
