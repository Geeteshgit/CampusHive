import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Projects.css'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import ProjectsUpload from '../../components/ProjectsUpload/ProjectsUpload'
import ProjectCards from '../../components/ProjectCards/ProjectCards'

const Projects = () => {

  const [showSidebar, setShowSidebar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  const getAllProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/project`);        
        setProjects(response.data);
      } catch (err) {
        console.log(err.response?.data.message || "Something went wrong!");
      }
  }

  useEffect(() => {
    getAllProjects();
  }, []);
  
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = projects.filter(project => {
      const query = searchQuery.toLowerCase();
      return (
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.technologies?.toLowerCase().includes(query) ||
        project.lookingFor?.toLowerCase().includes(query)
      );
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
    <Header toggleSidebar={toggleSidebar}/>
    <div className="components-container">
        <SideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <main id='projects'>
            <div id="projects-header-container">
                <div className='projects-header-data'>
                    <h1>Student Projects</h1>
                    <p>Discover projects or share your own to find collaborators</p>
                </div>
                <button onClick={() => {setIsOpen(isOpen ? false : true)}}>
                    {isOpen && <i className="ri-close-line"></i>}
                    {!isOpen && <i className="ri-add-line"></i>}
                    {isOpen ? 'Cancel' : 'Add Project'}
                </button>
            </div>
            {isOpen && <ProjectsUpload setIsOpen={setIsOpen} setProjects={setProjects} />}
            <div className='projects-search'>
                <i className="ri-search-line search"></i>
                <input 
                  type="text" 
                  placeholder='Search by title, technologies, or roles...'
                  value={searchQuery}
                  onChange={(e) => {setSearchQuery(e.target.value)}}  
                />
            </div>
            <div id='projects-container'>
                {sortedProjects.map((project) => {
                    return <ProjectCards 
                    key = {project._id} 
                    user = {project.user?._id}
                    name = {project.title} 
                    description = {project.description} 
                    date = {new Date(project.createdAt).toLocaleDateString('en-GB')} 
                    lookingFor = {project.lookingFor}
                    technologies = {project.technologies} 
                />
                })}
            </div>
        </main>
    </div>
    </>
  )
}

export default Projects