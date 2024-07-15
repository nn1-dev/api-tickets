import { Html } from "npm:@react-email/html";
import { Head } from "npm:@react-email/head";
import { Body } from "npm:@react-email/body";
import { Container } from "npm:@react-email/container";
import { Img } from "npm:@react-email/img";
import { Text } from "npm:@react-email/text";
import { Button } from "npm:@react-email/button";
import { Link } from "npm:@react-email/link";
import { render } from "npm:@react-email/render";
import style from "./style.tsx";

interface EmailSignupConfirmProps {
  eventName: string;
  url: string;
}

export const EmailSignupConfirm = ({
  eventName,
  url,
}: EmailSignupConfirmProps) => (
  <Html>
    <Head />
    <Body style={style.body}>
      <Container style={style.container}>
        <Img
          src="https://nn1.dev/logo-email.png"
          width="119"
          height="28"
          alt="NN1 Dev Club Logo"
          style={style.img}
        />
        <Text style={style.text}>
          Thanks for signing up for the upcoming NN1 Dev Club event,{" "}
          <strong>{eventName}</strong>. We don't like bots, so to ensure you are
          not one, please confirm your email address by clicking the button
          below. You will be all set up!{" "}
        </Text>
        <Button href={url} style={style.button}>
          Confirm your email
        </Button>
        <Text style={style.text}>
          If you have issues or questions, please reply to this email, or reach
          out to us on social media channels:{" "}
          <Link style={style.link} href="http://linkedin.com/company/nn1-dev">
            LinkedIn
          </Link>
          ,{" "}
          <Link style={style.link} href="https://mastodon.social/@nn1dev">
            Mastodon
          </Link>{" "}
          and{" "}
          <Link style={style.link} href="https://x.com/nn1dev">
            X (Twitter)
          </Link>
          .{" "}
        </Text>
      </Container>
    </Body>
  </Html>
);

EmailSignupConfirm.PreviewProps = {
  eventName:
    '#1: "Boiling Nemo" by PJ Evans and "The Science of Software Engineering" by Junade Ali',
  url: "#",
} as EmailSignupConfirmProps;

const renderEmailSignupConfirm = (props: EmailSignupConfirmProps) => ({
  html: render(<EmailSignupConfirm {...props} />),
  text: render(<EmailSignupConfirm {...props} />, { plainText: true }),
});

export default EmailSignupConfirm;
export { renderEmailSignupConfirm };
