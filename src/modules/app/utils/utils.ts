export const formatTime = (time: string): number => {
  //It is very vegan, but it works, I guess...
  let mins = 0;
  const asArr = time.split(' ');
  if (asArr[1] === 'hours' || asArr[1] === 'hour') {
    mins = mins + +asArr[0] * 60;
    if (asArr[3] && (asArr[3] === 'mins' || asArr[3] === 'min')) {
      mins = mins + +asArr[2];
    }
  } else {
    mins = mins + +asArr[0];
  }
  return mins;
};
