import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/cats')
      .then(response => response.json())
      .then(data => {
        setCats(data)
        console.log(data)
  })
      .catch(error => console.error('Error fetching cats:', error));
  }, []);

  return (
    <>
      <div className="scrollable-list">
        {cats.map(cat => (
          <img key={cat.id} src={cat.img_url} width={cat.img_width} height={cat.img_height} alt="Cat" />
        ))}
      </div>
    </>
  )
}

export default App
