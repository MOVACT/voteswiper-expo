import React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

const SvgCircleHelp: React.FC<SvgProps> = (props) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" {...props}>
    <G fill="none" fillRule="evenodd">
      <Path fill="#FFF" d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
      <Path
        fill="#8186D7"
        fillRule="nonzero"
        d="M10 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1-5.5a1 1 0 0 1-2 0v-1.41a1 1 0 0 1 .55-.9L12 8.5c.64-.42 1-.97 1-1.5 0-1.03-1.3-2-3-2-1.35 0-2.49.62-2.87 1.43a1 1 0 0 1-1.8-.86C6.05 4.01 7.92 3 10 3c2.7 0 5 1.72 5 4 0 1.3-.76 2.46-2.05 3.24L11 11.2v.8z"
      />
    </G>
  </Svg>
);

export default SvgCircleHelp;
