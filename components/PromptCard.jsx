"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef } from 'react';
import CardPopup from "./CardPopup";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick, refresh}) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    handleMouseLeave();
    setShowPopup(!showPopup);
  };


  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 3;
    const centerY = rect.height / 3;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const rotateX = percentY * -2; // Rotate between -15deg to 15deg
    const rotateY = percentX * 2; // Rotate between -15deg to 15deg

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };

  const handleProfileClick = () => {
    console.log(post);

    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };


  

  return (
    <div 
    className='prompt_card'
    ref={cardRef}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    onClick={() => {
      console.log(post)
      {togglePopup()}
    }}>
      {showPopup && (
      <CardPopup
      promptId={post._id}
      closePopup={togglePopup}
      refresh={refresh}
      />
      
      )}


      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'>
          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-300'>
              {post.title}
            </h3>
          </div>
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-400 prompt_text'>{post.prompt}</p>
      <p
        className='font-inter text-sm blue_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>
    </div>
    
  );
};

export default PromptCard;
