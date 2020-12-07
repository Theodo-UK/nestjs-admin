const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <img className="homeLogo" src={`${baseUrl}img/logo-with-name.png`} alt="NestJS-admin" />
        <div className="homeTagline">{siteConfig.tagline}</div>
        <PromoSection>
          <Button href={docUrl('install')}>Get Started</Button>
          <Button href={docUrl('contributing')}>Contribute</Button>
        </PromoSection>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
        <GridBlock align="center" contents={props.children} layout={props.layout} />
      </Container>
    );

    const Features = () => (
      <Block layout="threeColumn">
        {[
          {
            content: 'Create, update and delete, without needing to configure endpoints',
            image: `${baseUrl}img/undraw_personal_settings.svg`,
            imageAlign: 'top',
            title: 'All your entities in one place',
          },
          {
            content:
              'Just link your entities to the admin and let your developers focus on important features',
            image: `${baseUrl}img/undraw_developer_activity.svg`,
            imageAlign: 'top',
            title: 'Minimal developer time',
          },
          {
            content:
              'Our admin interface is designed for non-technical users to get started straight away',
            image: `${baseUrl}img/undraw_filing_system.svg`,
            imageAlign: 'top',
            title: 'No specialist knowledge',
          },
        ]}
      </Block>
    );

    const List = () => (
      <Block background="dark">
        {[
          {
            content: `Create, update and delete entities at the press of a button
              - long before you need to write any user-facing code. A generic
              backoffice for all your entities allows for maximum flexibility
              during development and beyond.`,
            image: `${baseUrl}img/screenshot-list.png`,
            imageAlign: 'right',
            title: 'All your entities in one place',
          },
        ]}
      </Block>
    );

    const Form = () => (
      <Block background="light">
        {[
          {
            content: `NestJS Admin can be installed on a project in a matter of
              minutes and used straight away with your existing entities.
              A straightforward interface allows any non-technical team member to
              manage your entities while developers focus on the important stuff.`,
            image: `${baseUrl}img/screenshot-form.png`,
            imageAlign: 'left',
            title: 'Manage your entities instantly',
          },
        ]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer noPadding">
          <Features />
          <List />
          <Form />
        </div>
      </div>
    );
  }
}

module.exports = Index;
