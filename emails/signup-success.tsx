import { Html } from "npm:@react-email/html";
import { Head } from "npm:@react-email/head";
import { Body } from "npm:@react-email/body";
import { Container } from "npm:@react-email/container";
import { Img } from "npm:@react-email/img";
import { Text } from "npm:@react-email/text";
import { Hr } from "npm:@react-email/hr";
import { render } from "npm:@react-email/render";
import style from "./style.tsx";

interface EmailSignupSuccessProps {
  what: string;
  when: string;
  where: string;
}

export const EmailSignupSuccess = ({
  what,
  when,
  where,
}: EmailSignupSuccessProps) => (
  <Html>
    <Head />
    <Body style={style.body}>
      <Container>
        <Img
          src="https://nn1.dev/logo-email.png"
          width="119"
          height="28"
          alt="NN1 Dev Club Logo"
          style={style.img}
        />
        <Text style={style.text}>
          Thanks for signing up for the upcoming NN1 Dev Club event. We can't
          wait to see you! Here is handy information about the event.
        </Text>
        <Text style={style.text}>
          <strong>What: </strong>
          <br />
          {what}
          <br />
          <br />
          <strong>When: </strong>
          <br />
          {when}
          <br />
          <br />
          <strong>Where: </strong>
          <br />
          {where}
          <Hr style={style.hr} />
          <Text style={style.text}>Have a good day 👋</Text>
        </Text>{" "}
      </Container>
    </Body>
  </Html>
);

EmailSignupSuccess.PreviewProps = {
  what: '#1: "Boiling Nemo" by PJ Evans and "The Science of Software Engineering" by Junade Ali',
  when: "Wednesday, 27/03/2024, 18:00",
  where: "Vulcan Works, 34-38 Guildhall Rd, Northampton, NN1 1EW",
} as EmailSignupSuccessProps;

const renderEmailSignupSuccess = (props: EmailSignupSuccessProps) => ({
  html: render(<EmailSignupSuccess {...props} />),
  text: render(<EmailSignupSuccess {...props} />, { plainText: true }),
});

export default EmailSignupSuccess;
export { renderEmailSignupSuccess };
