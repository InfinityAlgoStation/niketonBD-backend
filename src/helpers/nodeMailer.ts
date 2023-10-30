/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from 'nodemailer';
import config from '../config';

const transporterOptions = {
  host: `${config.email_host.name}`,
  port: Number(config.email_host.port),
  secure: true,
  auth: {
    user: `${config.email_host.user}`,
    pass: `${config.email_host.password}`,
  },
};

const transporter = nodemailer.createTransport(transporterOptions);

type TEmailInfo = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sentEmail = async (payload: TEmailInfo) => {
  const info = await transporter.sendMail(payload);
  return info;
};
