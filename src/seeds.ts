/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { createCanvas } from 'canvas';
import dotenv from 'dotenv';
import { floor, random } from 'lodash';

dotenv.config({});

const avatarColor = (): string => {
  const colors: string[] = [
    '#AFBFD2', '#E7CBA9', '#D4A190', '#CFA8D1', '#A4D4AE', '#F2A0A1', '#E5E5E5', '#BBAB9E', '#FBD6C8', '#E7C9B1', '#F7B500', '#F6D7C3', '#B8E2C8',
    '#BFE0C9', '#C3D8E8', '#FF69B4', '#00CED1', '#9370DB', '#8B0000', '#7B68EE', '#ADFF2F', '#1E90FF', '#9B4E4F', '#6D7F82', '#3E9BAF'
  ];
  return colors[floor(random(0.9) * colors.length)];
};

const generateAvatar = (text: string, backgroundColor: string, forgroundColor = 'white') => {
  const canvas = createCanvas(200, 200);
  const context = canvas.getContext('2d');

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = 'normal 80px sans-serif';
  context.fillStyle = forgroundColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width/2, canvas.height/2);

  return canvas.toDataURL('image/png');
};

const seedUserData = async (count: number): Promise<void> => {
  let i = 0;
  try {
    for(i = 0; i < count; i++) {
      const username = faker.internet.userName();
      console.log({username});
      const color = avatarColor();
      const avatar = generateAvatar(username.charAt(0).toUpperCase(), color);

      const body = {
        username,
        email: faker.internet.email(),
        password: 'ronak',
        avatarColor: color,
        avatarImage: avatar
      };
      console.log(`*** SEEDING USER TO DATABASE *** - ${i+1} - ${count} - ${username}`);
      await axios.post(`${process.env.API_URL}/signup`, body);
    }
  } catch (error: any) {
    console.log(error?.response?.data);
  }
};

seedUserData(10);
