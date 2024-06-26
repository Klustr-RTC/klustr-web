const LogoIcon = ({ className, color }: { color?: string; className: string | undefined }) => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="300.000000pt"
      height="300.000000pt"
      className={className}
      viewBox="0 0 300.000000 300.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
        fill={color ?? '#000000'}
        stroke="none"
      >
        <path d="M1341 2749 c-213 -25 -449 -123 -627 -259 -83 -65 -215 -208 -277 -301 -143 -216 -208 -435 -209 -704 0 -381 163 -729 453 -969 212 -174 460 -273 731 -292 l98 -7 0 77 c0 141 -37 184 -182 210 -333 61 -583 246 -730 541 -75 149 -102 274 -101 455 1 160 27 276 92 415 223 475 781 697 1270 503 470 -186 727 -698 596 -1188 -27 -101 -100 -258 -144 -310 l-26 -31 -307 308 -307 308 210 280 210 280 -137 3 c-205 4 -175 28 -489 -391 l-260 -347 -5 323 c-4 289 -7 326 -23 350 -33 51 -73 67 -164 67 l-83 0 0 -580 0 -580 115 0 c123 0 169 11 213 53 13 12 73 88 134 169 61 82 113 148 117 148 3 0 148 -142 321 -316 173 -173 333 -325 355 -337 54 -29 154 -29 210 0 126 66 280 343 336 604 32 148 32 381 0 524 -145 644 -740 1069 -1390 994z" />
      </g>
    </svg>
  );
};

export default LogoIcon;
