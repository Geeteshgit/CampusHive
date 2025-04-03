import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'
import './ProjectsTab.css'

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProjectsTab = () => {
  const [projectCards, setProjectCards] = useState([]);

  const getUserProjects = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/project/userprojects`, 
        { withCredentials : true });
      setProjectCards(response.data);      
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/api/project/${id}`, 
        { withCredentials : true });
      setProjectCards(prev => prev.filter(project => project._id !== id));
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  useEffect(() => {
    getUserProjects();
  }, [])
  

  return (
    <div id='project-tab'>
      <h2>Your Projects</h2>
      <div className='user-project-cards'>
        {projectCards.map(project => {
          return <div id='user-project-card' key={project._id}>
                <div className='user-project-card-details'>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>
                <button onClick={()=>deleteHandler(project._id)}><i className="ri-delete-bin-line"></i></button>
          </div>
        })}
      </div>
    </div>
  )
}

export default ProjectsTab