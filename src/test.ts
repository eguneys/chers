import chars from './chars';

function jss(o: any) {
  console.log(JSON.stringify(o));
}

export default function() {

  // const text = `lkja sdf@#$ ^234 890..la\< ns>k\ndfl.`;
  // console.log(chars(text));

  const headlineOnly: string = `# aheadline\n`;
  const textOnly: string = `atext`;

  const recContent: string = [headlineOnly,
                      textOnly,
                      textOnly,
                      headlineOnly,
                      textOnly].join('separator');

  //jss(chars(textOnly));
  //jss(chars(headlineOnly));
  jss(chars(recContent));
  
}
