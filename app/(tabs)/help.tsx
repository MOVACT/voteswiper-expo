import Container from "@/components/Container";
import Loader from "@/components/Loader";
import Txt from "@/components/Txt";
import fetchStoryblok from "@/connectors/storyblok";
import { useApp } from "@/contexts/app";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ifIphoneX } from '@/util/iPhoneXHelper';
import ScrollContainer from "@/components/ScrollContainer";
import { LinearGradient } from "expo-linear-gradient";
import Accordion from 'react-native-collapsible/Accordion';
import render from "@/util/storyblok-rich-text";

const Help: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [story, setStory] = React.useState<any>(null);
  const [activeSections, setActiveSections] = React.useState([]);
  const { language } = useApp();

  React.useEffect(() => {
    fetchStoryblok("48429742", language ?? "en").then((response) => {
      setStory(response.data.story);
      setLoading(false);
    });
  }, [language]);

  if (loading) {
    return (
      <Container>
        <Loader fullscreen />
      </Container>
    );
  }

  const updateSections = (sections: any) => {
    setActiveSections(sections);
  };

  const renderSectionTitle = () => {
    return <View style={styles.content} />;
  };

  const renderHeader = (section: any) => {
    return (
      <View style={styles.header}>
        <Txt medium style={styles.headerText}>
          {section.title}
        </Txt>
      </View>
    );
  };

  const renderContent = (section: any) => {
    return (
      <View style={styles.content}>
        <View style={styles.contentInner}>{render(section.body)}</View>
      </View>
    );
  };

  return (
    <Container>
      <ScrollContainer withPadding>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#fff', '#EFF3FF']}
          style={styles.container}>
          <Accordion
            activeSections={activeSections}
            sections={story.content.questions}
            renderSectionTitle={renderSectionTitle}
            renderHeader={renderHeader}
            renderContent={renderContent}
            touchableProps={{
              underlayColor: 'transparent',
            }}
            onChange={updateSections}
          />
        </LinearGradient>
      </ScrollContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(57,47,82,0.1)',
  },
  contentInner: {
    padding: 20,
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#59568B',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(57,47,82,0.1)',
  },
  root: {
    padding: 25,
    ...ifIphoneX({paddingTop: 40}, {paddingTop: 15}),
  },
  screenTitle: {
    paddingBottom: 20,
  },
});


export default Help;
