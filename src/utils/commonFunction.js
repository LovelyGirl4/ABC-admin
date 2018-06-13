import React from 'react';

export const calcTime = (time) => {
    const newTime = new Date(time);
    return <span>{newTime.toLocaleDateString()}&nbsp;{newTime.toTimeString().split(' ')[0]}</span>;
};

export const todayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    return `${year}${month}${day}${date.getHours()}${date.getMinutes()}`;
};
