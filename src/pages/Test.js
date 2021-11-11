import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Test.css';

import PictureWall from '../components/PictureWall';

export default function Test() {
    return (
        <div className = "mp-test">
            <PictureWall
                
            />
        </div>
    );
}
