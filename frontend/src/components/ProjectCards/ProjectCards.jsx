import React from 'react'
import './ProjectCards.css'
import { useNavigate } from 'react-router-dom';

const ProjectCards = (props) => {

    const navigate = useNavigate();
    const clickHandler = (user) => {
        navigate(`/messages/${user}`);
    }

  return (
    <div id='project-card'>
        <div className="projects-data">
            <div className='projects-data-header'>
                <h3>{props.name}</h3>
                <div className="projects-data-date">
                    <i className="ri-calendar-line"></i>
                    <p>{props.date}</p>
                </div>
            </div>
            <div className='projects-content'>
                <p>{props.description}</p>
                <div className='projects-roles'>
                    <span><i className="ri-price-tag-3-line"></i> TECHNOLOGIES :</span>
                    <p>{props.technologies}</p>
                </div>
                <div className='projects-roles'>
                    <span><i className="ri-search-line"></i> LOOKING FOR :</span>
                    <p>{props.lookingFor}</p>
                </div>
            </div>
            <button onClick={() => clickHandler(props.user)}><i className="ri-send-plane-fill"></i>Contact</button>
        </div>
    </div>
  )
}

export default ProjectCards