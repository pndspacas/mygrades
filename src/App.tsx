import { useEffect, useState } from 'react';
import { HiOutlinePlusSm, HiOutlineX } from "react-icons/hi"

interface Subject {
  id: number;
  name: string;
  grade: string;
}


const App = () => {
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<string>('');
  const [newGrade, setNewGrade] = useState<string>("");

  useEffect(() => {
    try {
      const savedSubjectList = localStorage.getItem('subjectList');
      if (savedSubjectList) {
        setSubjectList(JSON.parse(savedSubjectList));
      }
    } catch (error) {
      console.error('Error parsing data from localStorage:', error);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('subjectList', JSON.stringify(subjectList));
  }, [subjectList]);


  const addSubject = () => {
    if (newSubject.trim() !== '') {
      setSubjectList([...subjectList, { id: subjectList.length, name: newSubject, grade: newGrade }]);
      setNewSubject('');
      setNewGrade('');
    }
  };

  const removeSubject = (id: number) => {
    setSubjectList(subjectList.filter((subject) => subject.id !== id));
  };

  const calculateFinalGrade = () => {
    const totalGrades = subjectList.reduce((sum, subject) => sum + Number(subject.grade), 0);
    return subjectList.length > 0 ? totalGrades / subjectList.length : 0;
  };

  const finalGrade = calculateFinalGrade();
  const isButtonDisabled = newSubject.trim() === "" || newGrade.trim() === ""

  const handleNewSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z]*$/.test(inputValue) || inputValue === '') {
      const capitalizedSubject = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
      setNewSubject(capitalizedSubject);
    }
  };

  const handleNewGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    const gradeValue = Math.min(Number(inputValue), 20);
    setNewGrade(gradeValue.toString());
  };

  return (
    <>
      <h1 className='text-center text-4xl m-10'>My Grades</h1>
      <div className='text-center m-10 p-10 flex justify-center'>
        <input className='text-xl mx-1 border-2 rounded text-center'
          type="text"
          placeholder="Enter Subject"
          value={newSubject}
          onChange={handleNewSubjectChange}
        />
        <input className='text-xl mx-1 border-2 rounded text-center'
          type="text"
          placeholder="Enter Grade"
          value={newGrade === '0' ? '' : newGrade.toString()}
          onChange={handleNewGradeChange}
        />
        <button disabled={isButtonDisabled} className={`py-1 px-4 rounded mx-2 ${isButtonDisabled ? 'bg-blue-300' : 'bg-blue-500 text-white hover:bg-blue-600 font-bold'}`}
          onClick={addSubject}> <HiOutlinePlusSm className="text-2xl text-white" /></button>

      </div>
      {subjectList.length >= 1 && <div className="m-5 table-fixed shadow-md rounded">
        <table className="w-full text-md text-center text-gray-800 dark:text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-800 dark:text-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">Subject</th>
              <th scope="col" className="px-6 py-3">Grade</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {subjectList.map((subject) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={subject.id}>
                <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">{subject.name}</th>
                <td className="px-6 py-4">{subject.grade}</td>
                <td className="px-6 py-4">
                  <button className='py-2 rounded'
                    onClick={() => removeSubject(subject.id)}><HiOutlineX className="text-2xl text-black hover:text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
      {subjectList.length >= 1 && <div className='flex justify-center gap-2 m-5'>
        <span className='text-2xl'>Final Grade : </span>
        <span className={`text-2xl ${finalGrade > 10 ? 'text-green-500' : 'text-red-500'}`}>{calculateFinalGrade().toFixed(2)}</span>
      </div>}
    </>
  );
}

export default App;
