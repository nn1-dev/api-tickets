import { Html } from "npm:@react-email/html";
import { Head } from "npm:@react-email/head";
import { Body } from "npm:@react-email/body";
import { Container } from "npm:@react-email/container";
import { Img } from "npm:@react-email/img";
import { Text } from "npm:@react-email/text";
import { Button } from "npm:@react-email/button";
import { render } from "npm:@react-email/render";
import style from "./style.tsx";

interface EmailSignupConfirmProps {
  url: string;
}

export const EmailSignupConfirm = ({ url }: EmailSignupConfirmProps) => (
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
          Thanks for signing up for the upcoming NN1 Dev Club event. We need to
          make sure that you are you. Please confirm your email address by
          clicking the button below, and you will be all setup!
        </Text>
        <Button href={url} style={style.button}>
          Confirm your email
        </Button>
      </Container>
    </Body>
  </Html>
);

EmailSignupConfirm.PreviewProps = {
  url: "#",
} as EmailSignupConfirmProps;

const renderEmailSignupConfirm = (props: EmailSignupConfirmProps) => ({
  html: render(<EmailSignupConfirm {...props} />),
  text: render(<EmailSignupConfirm {...props} />, { plainText: true }),
});

export default EmailSignupConfirm;
export { renderEmailSignupConfirm };
