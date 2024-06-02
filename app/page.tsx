"use client";
import Typewriter from 'typewriter-effect';
import { FaLinkedin, FaGithub, FaTelegram } from "react-icons/fa";
import { motion } from "framer-motion"
import {useState} from "react";
import Link from "next/link";

export default function Home() {
    const [stop, setStop] = useState(false);

    return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
          <div className={'mb-12'}>
              <Typewriter
                  options={{
                      delay: 50,
                  }}
                  onInit={(typewriter) => {
                      typewriter
                          .typeString('<h1 className="h1">Aleksandr Shatskikh</h1>')
                          .pauseFor(300)
                          .typeString('<h2 className="h2">Front-end')
                          .pauseFor(300)
                          .deleteChars(9)
                          .typeString('<h2 className="h2">Full-stack web-engineer</h2>')
                          .callFunction(() => {
                              setStop(true)
                          })
                          .start();
                  }}
              />
          </div>
          {stop && <div className={'flex justify-center w-full gap-4'}>
              <motion.span
                  initial={{
                      opacity: 0,
                  }}
                  animate={{
                      opacity: 1,
                  }}
                  transition={{ duration: 1, delay: 0.5}}
              >
                  <Link href={'https://www.linkedin.com/in/aleksandr-shatskikh'} target={'_blank'} rel={'nofollow'}>
                      {/*@ts-ignore*/}
                      <FaLinkedin className={'h-10 w-10'} />
                  </Link>
              </motion.span>
              <motion.span
                  initial={{
                      opacity: 0,
                  }}
                  animate={{
                      opacity: 1,
                  }}
                  transition={{ duration: 1, delay: 1 }}
              >
                  <Link href={'https://github.com/errand'} target={'_blank'} rel={'nofollow'}>
                      {/*@ts-ignore*/}
                      <FaGithub className={'h-10 w-10'} />
                  </Link>
              </motion.span>
              <motion.span
                  initial={{
                      opacity: 0,
                  }}
                  animate={{
                      opacity: 1,
                  }}
                  transition={{ duration: 1, delay: 1.5 }}
              >
                  <Link href={'https://t.me/mrerrand'} target={'_blank'} rel={'nofollow'}>
                      {/*@ts-ignore*/}
                      <FaTelegram className={'h-10 w-10'} />
                  </Link>
              </motion.span>
          </div>}


      </div>
    </main>
    );
}
