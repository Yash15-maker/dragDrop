import { useState } from 'react';
import './App.css';

const bodyPart = [
  'text',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'date',
  'number',
  'email',
];

const App = () => {
  const [formComponents, setFormComponents] = useState([]);
  const [draggedFromLeft, setDraggedFromLeft] = useState(false);
  const handleDragStartLeft = (e, component) => {
    e.dataTransfer.setData('component', component);
    setDraggedFromLeft(true);
  };
  const handleDropLeftToRight = (e) => {
    const component = e.dataTransfer.getData('component');
    if (draggedFromLeft) {
      setFormComponents((prevComponents) => [
        ...prevComponents,
        { id: `item-${prevComponents.length + 1}`, name: component },
      ]);
      setDraggedFromLeft(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDragStartRight = (e, index) => {
    e.dataTransfer.setData('startIndex', index);
    setDraggedFromLeft(false);
  };
  const handleDropRight = (e, dropIndex) => {
    const startIndex = e.dataTransfer.getData('startIndex');
    if (!draggedFromLeft) {
      reorderComponents(Number(startIndex), dropIndex);
    }
  };
  const reorderComponents = (startIndex, endIndex) => {
    const updatedComponents = [...formComponents];
    const [moved] = updatedComponents.splice(startIndex, 1);
    updatedComponents.splice(endIndex, 0, moved);
    setFormComponents(updatedComponents);
  };
  return (
    <div style={{ display: 'flex' }}>
      <div className="sidebar">
        <h3>Form Linked Body parts</h3>
        {bodyPart.map((component, index) => (
          <div key={index} style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '20px' }}>
            <input
              className="draggable"
              draggable
              placeholder={component}
              type={component}
              onDragStart={(e) => handleDragStartLeft(e, component)}
            /
            >
          </div>
        ))}
      </div>
      <div
        className="form-builder"
        onDrop={handleDropLeftToRight}
        onDragOver={handleDragOver}
      >
        <h3>Form Layout</h3>
        {formComponents.map((component, index) => (
          <div key={component.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ color: "black", textTransform: 'capitalize', marginBottom: '5px' }}>{component.name}</span>
            <input
              className="form-component"
              draggable
              type={component.name}
              onDragStart={(e) => handleDragStartRight(e, index)}
              onDrop={(e) => handleDropRight(e, index)}
              onDragOver={handleDragOver}
              placeholder={component.name}
              required={index < 3}
            /
            >
            {index < 3 && <strong style={{ color: 'red', marginBottom: '10px' }}> (Required)</strong>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
