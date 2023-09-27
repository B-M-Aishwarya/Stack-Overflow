import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Badges from './Badge';

import './ProfileBio.css';

const ProfileBio = ({ currentProfile }) => {
  
  return (
    <div className='bio'>
       <div>
       <Badges />
       </div>
      <div className='tag-bio'>
        {
          currentProfile?.tags.length !== 0 ? (
            <>
              <h4>Tags Watched</h4>
              {
                currentProfile?.tags.map((tag) => (
                    <p key={tag}>{tag}</p>
                  ))
              }
            </>
         ) : (
            <p>0 tags watched</p>
          )
        }
      </div>
      <div>
        {currentProfile?.about ? (
          <>
            <h4>About</h4>
            <p>{currentProfile?.about}</p>
          </>
        ) : (
          <p>No bio found</p>
        )}
      </div>
    </div>   
  )
}

export default ProfileBio
