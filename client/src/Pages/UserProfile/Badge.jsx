import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import './ProfileBio.css'

import gold from '../../assets/gold.png'
import silver from '../../assets/silver.png'
import bronze from '../../assets/bronze.png'

const Badge = () => {

  const { id } = useParams();
  const users = useSelector((state) => state.usersReducer);
  const currentProfile = users.find((user) => user._id === id);

    return (
      <div className='badg'>
        <h3>Badges</h3>
            <div className="badge-container">
              <div className="badge gold-badge">
              <div className="badge-content">
                <img src={gold} alt="gold" />
                <h1>{currentProfile?.badges?.Gold}</h1>
                <p>gold badges</p>
              </div>
                <div className='tag-badge'><p>ans question</p></div>
              </div>
              <div className="badge silver-badge">
              <div className="badge-content">
                <img src={silver} alt="silver" />
                <h1>{currentProfile?.badges?.Silver}</h1>
                <p>silver badges</p>
              </div>
              <div className='tag-badge'><p>votes</p></div>
              </div>
              <div className="badge bronze-badge">
              <div className="badge-content">
                <img src={bronze} alt="bronze" />
                <h1>{currentProfile?.badges?.Bronze}</h1>
                <p>bronze badges</p>
              </div>
              <div className='tag-badge'><p>post question</p></div>
              </div>
            </div>
      </div>
    );
  };

export default Badge