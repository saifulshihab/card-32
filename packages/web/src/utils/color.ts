export const generateRandomColor = (): string => {
  const letters = "0123456789ABCDEF".split("");
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const colors = [
  "#e74c3c",
  "#5ac8fa",
  "#4cd964",
  "#f1c40f",
  "#bb86fc",
  "#ff2d55",
];
