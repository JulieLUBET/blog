import React, { useState } from "react";

export default function ClickCounter (){
    const [count, setCount] = useState(0)

    return <div>
        <p>Vous avez cliquez {count} fois !</p>
        <button onClick={() => setCount(count + 1)}>Cliquez ici !</button>
    </div>
}