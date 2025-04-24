import React, { useState } from 'react'
import './ProjectsUpload.css'
import axios from 'axios'

const ProjectsUpload = ({ setIsOpen, setProjects }) => {

  const [projectData, setProjectData] = useState({
    title : "",
    description : "",
    technologies : "",
    lookingFor : "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev, [name] : value
    }));
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/project`,
          projectData , 
          { withCredentials : true });
          setProjects(prev => [...prev, response.data]);
          setIsOpen(false);
    } catch (err) {
        alert(err.response?.data.message || "Something went wrong");
    }
    setProjectData({
      title : "",
      description : "",
      technologies : "",
      lookingFor : "",
    });

  }

  return (
    <main id='projects-upload'>
        <h2>Add New Project</h2>
        <form onSubmit={submitHandler}>
          <div className='upload-project-inputs'>
            <label>Project Title</label>
            <input 
              type="text" 
              placeholder='e.g., Campus Navigation App'
              name='title'
              value={projectData.title}
              onChange={changeHandler}
              />
          </div>
          <div className='upload-project-inputs'>
            <label>Description</label>
            <textarea 
              placeholder="Describe your project, its goals, and what stage it's at..."
              name = 'description' 
              value={projectData.description}
              onChange={changeHandler}
              rows={6} />
          </div>
          <div className='upload-project-container'>
            <div className='upload-project-inputs'>
              <label>Technologies {"(comma-separated)"}</label>
              <input 
                type="text"
                placeholder='React. TypeScript, Firebase'
                name='technologies'
                value={projectData.technologies}
                onChange={changeHandler}
              />
            </div>
            <div className='upload-project-inputs'>
              <label>Looking For {"(comma-separated)"}</label>
              <input 
                type="text"
                placeholder='Frontend dev, UX Designer'
                name='lookingFor'
                value={projectData.lookingFor}
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className='upload-project-submit'>
            <button><i className="ri-edit-line"></i> Post Project</button>
          </div>
        </form>
    </main>
  )
}

export default ProjectsUpload