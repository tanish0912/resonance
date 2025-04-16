import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

// We'll use a music-themed animation from LottieFiles
// This is a placeholder URL - in a real app, you'd download this JSON file
const musicLoadingAnimation = {
  v: "5.7.1",
  fr: 30,
  ip: 0,
  op: 60,
  w: 512,
  h: 512,
  nm: "Music Loading",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Bar 1",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [192, 256, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
      },
      ao: 0,
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [24, 100], ix: 2 },
          p: { a: 0, k: [0, 0], ix: 3 },
          r: { a: 0, k: 12, ix: 4 },
          nm: "Rectangle",
          mn: "ADBE Vector Shape - Rect",
          hd: false
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.937, 0.937, 0.937, 1], ix: 4 },
          o: { a: 0, k: 100, ix: 5 },
          r: 1,
          bm: 0,
          nm: "Fill",
          mn: "ADBE Vector Graphic - Fill",
          hd: false
        },
        {
          ty: "tm",
          s: { a: 0, k: 0, ix: 1 },
          e: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [50] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [50] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [20] },
              { t: 60, s: [50] }
            ],
            ix: 2
          },
          o: { a: 0, k: 0, ix: 3 },
          m: 1,
          ix: 3,
          nm: "Trim Paths",
          mn: "ADBE Vector Filter - Trim",
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Bar 2",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [256, 256, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
      },
      ao: 0,
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [24, 100], ix: 2 },
          p: { a: 0, k: [0, 0], ix: 3 },
          r: { a: 0, k: 12, ix: 4 },
          nm: "Rectangle",
          mn: "ADBE Vector Shape - Rect",
          hd: false
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.937, 0.937, 0.937, 1], ix: 4 },
          o: { a: 0, k: 100, ix: 5 },
          r: 1,
          bm: 0,
          nm: "Fill",
          mn: "ADBE Vector Graphic - Fill",
          hd: false
        },
        {
          ty: "tm",
          s: { a: 0, k: 0, ix: 1 },
          e: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 10, s: [50] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 25, s: [100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 40, s: [50] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 55, s: [20] },
              { t: 70, s: [50] }
            ],
            ix: 2
          },
          o: { a: 0, k: 0, ix: 3 },
          m: 1,
          ix: 3,
          nm: "Trim Paths",
          mn: "ADBE Vector Filter - Trim",
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Bar 3",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [320, 256, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
      },
      ao: 0,
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [24, 100], ix: 2 },
          p: { a: 0, k: [0, 0], ix: 3 },
          r: { a: 0, k: 12, ix: 4 },
          nm: "Rectangle",
          mn: "ADBE Vector Shape - Rect",
          hd: false
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.937, 0.937, 0.937, 1], ix: 4 },
          o: { a: 0, k: 100, ix: 5 },
          r: 1,
          bm: 0,
          nm: "Fill",
          mn: "ADBE Vector Graphic - Fill",
          hd: false
        },
        {
          ty: "tm",
          s: { a: 0, k: 0, ix: 1 },
          e: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 5, s: [50] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 20, s: [90] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 35, s: [40] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 50, s: [70] },
              { t: 65, s: [50] }
            ],
            ix: 2
          },
          o: { a: 0, k: 0, ix: 3 },
          m: 1,
          ix: 3,
          nm: "Trim Paths",
          mn: "ADBE Vector Filter - Trim",
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

interface LoadingAnimationProps {
  text?: string;
}

export default function LoadingAnimation({ text = "Loading..." }: LoadingAnimationProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-24 h-24">
        <Lottie animationData={musicLoadingAnimation} loop={true} />
      </div>
      <motion.p 
        className="mt-3 text-white/80 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
} 