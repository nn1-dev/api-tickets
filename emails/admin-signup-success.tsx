import { Html } from "npm:@react-email/html";
import { Head } from "npm:@react-email/head";
import { Body } from "npm:@react-email/body";
import { Container } from "npm:@react-email/container";
import { Img } from "npm:@react-email/img";
import { Text } from "npm:@react-email/text";
import { Hr } from "npm:@react-email/hr";
import { render } from "npm:@react-email/render";
import style from "./style.tsx";

interface EmailAdminSignupSuccessProps {
  name: string;
  email: string;
}

export const EmailAdminSignupSuccess = ({
  name,
  email,
}: EmailAdminSignupSuccessProps) => (
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
        <Text style={style.text}>New signup.</Text>
        <Hr style={style.hr} />
        <Text style={style.text}>
          <strong>Name:</strong>
          <br />
          {name}
          <br />
          <br />
          <strong>Email:</strong>
          <br />
          {email}
        </Text>
      </Container>
    </Body>
  </Html>
);

EmailAdminSignupSuccess.PreviewProps = {
  name: "Pawel Grzybek",
  email: "hey@ho.hi",
} as EmailAdminSignupSuccessProps;

const renderEmailAdminSignupSuccess = (
  props: EmailAdminSignupSuccessProps,
) => ({
  html: render(<EmailAdminSignupSuccess {...props} />),
  text: render(<EmailAdminSignupSuccess {...props} />, { plainText: true }),
});

export default EmailAdminSignupSuccess;
export { renderEmailAdminSignupSuccess };
