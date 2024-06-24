/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [clipboard, setClipboard] = useState('');
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:5000/data');
    setData(response.data);
  };

  const handleChange = (e, id, column) => {
    const newData = data.map(row => {
      if (row.id === id) {
        return { ...row, [column]: e.target.value };
      }
      return row;
    });
    setHistory([...history, { prevData: data, newData }]);
    setData(newData);
  };

  const handleAddRow = async () => {
    const response = await axios.post('http://localhost:5000/data', newRow);
    setData([...data, response.data]);
    setNewRow({});
  };

  const handleDeleteRow = async (id) => {
    await axios.delete(`http://localhost:5000/data/${id}`);
    setData(data.filter(row => row.id !== id));
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeleteColumn = (columnIndex) => {
    const newData = data.map(row => {
      delete row[`column${columnIndex + 1}`];
      return row;
    });
    setData(newData);
  };

  const handleUndo = () => {
    const lastAction = history.pop();
    if (lastAction) {
      setRedoStack([lastAction, ...redoStack]);
      setData(lastAction.prevData);
    }
  };

  const handleRedo = () => {
    const lastUndo = redoStack.shift();
    if (lastUndo) {
      setHistory([...history, lastUndo]);
      setData(lastUndo.newData);
    }
  };

  const handleCopy = (id, column) => {
    const cellValue = data.find(row => row.id === id)[column];
    setClipboard(cellValue);
  };

  const handlePaste = (id, column) => {
    const newData = data.map(row => {
      if (row.id === id) {
        return { ...row, [column]: clipboard };
      }
      return row;
    });
    setData(newData);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (id, column) => {
    const newData = data.map(row => {
      if (row.id === id) {
        return { ...row, [column]: '' };
      }
      return row;
    });
    setData(newData);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        handleUndo();
      } else if (e.ctrlKey && e.key === 'y') {
        handleRedo();
      } else if (e.ctrlKey && e.key === 'c') {
        handleCopy(selectedCell.id, selectedCell.column);
      } else if (e.ctrlKey && e.key === 'v') {
        handlePaste(selectedCell.id, selectedCell.column);
      } else if (e.key === 'Delete') {
        handleDelete(selectedCell.id, selectedCell.column);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy, handleDelete, handlePaste, handleRedo, handleUndo, selectedCell]);

  useEffect(() => {
    const saveData = async () => {
      await axios.put('http://localhost:5000/data/save', { data });
    };

    const saveInterval = setInterval(saveData, 5000);
    return () => clearInterval(saveInterval);
  }, [data]);

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {Array.from({ length: 86 }).map((_, index) => (
              <th key={index} className="py-2 px-4 bg-gray-200">Column {index + 1}</th>
            ))}
            <th className="py-2 px-4 bg-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {Array.from({ length: 86 }).map((_, index) => (
                <td key={index} className="border px-4 py-2">
                  <input
                    type="text"
                    value={row[`column${index + 1}`] || ''}
                    onChange={(e) => handleChange(e, row.id, `column${index + 1}`)}
                    onClick={() => setSelectedCell({ id: row.id, column: `column${index + 1}` })}
                  />
                </td>
              ))}
              <td className="border px-4 py-2">
                <button onClick={() => handleDeleteRow(row.id)}>Delete Row</button>
              </td>
            </tr>
          ))}
          <tr>
            {Array.from({ length: 86 }).map((_, index) => (
              <td key={index} className="border px-4 py-2">
                <input
                  type="text"
                  value={newRow[`column${index + 1}`] || ''}
                  onChange={(e) => setNewRow({ ...newRow, [`column${index + 1}`]: e.target.value })}
                />
              </td>
            ))}
            <td className="border px-4 py-2">
              <button onClick={handleAddRow}>Add Row</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
