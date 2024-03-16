import React, { useState } from "react";
import { useStoreState, useStoreActions } from "./store/hooks.ts";
import Timetable from "./Timetable";

function App() {
  const { name, course } = useStoreState((store) => store)
  const { updateDataThunk } = useStoreActions((store) => store)
  const [inputName, setInputName] = useState('');
  const [inputCourse, setInputCourse] = useState('');

  function handleChangeName() {
    updateDataThunk({
      name: inputName,
      course: inputCourse,
    });
  }

  return (
    <div className="App">
      <h1>{name}</h1>
      <input value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="change name" />
      <button onClick={handleChangeName}>Submit</button>
      <Timetable />
    </div>
  );
}

export default App;