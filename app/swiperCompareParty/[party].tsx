import {useLocalSearchParams, useNavigation} from 'expo-router';
import Box from '@/components/Box';
import ButtonDark from '@/components/ButtonDark';
import Container from '@/components/Container';
import ScrollContainer from '@/components/ScrollContainer';
import Title from '@/components/Title';
import Txt from '@/components/Txt';
import {useApp} from '@/contexts/app';
import {useSwiper} from '@/contexts/swiper';
import React from 'react';
import {Dimensions, Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import { sm } from '@/common/breakpoints';


const SwiperCompareParty: React.FC = () => {
  const {setOptions} = useNavigation();
  const {t} = useApp();
  const { party } = useLocalSearchParams();
  const {answers, election} = useSwiper();
  const [showReason, setReason] = React.useState<null | number>(null);

  const partyData = election?.parties.find(p => p.id === parseInt(party as string))!;

  React.useEffect(() => {
    setOptions({
      // {1} ile Karşılaştır
      title: `Vergleich mit ${partyData.name}`,
    });
  });

  const getAnswer = React.useCallback(
    (id: number) => {
      if (answers[election!.id][id] == null) {
        return {doubleWeight: false, answer: 0};
      }

      return answers[election!.id][id];
    },
    [answers, election],
  );

  const getPartyAnswer = React.useCallback(
    (question: any) => {
      return partyData.pivot.answers.find((a) => a.question_id === question);
    },
    [partyData],
  );

  return (
    <Container noPadding>
      <ScrollContainer contentContainerStyle={styles.container}>
        <View style={styles.party}>
          <View style={styles.partyLogoContainer}>
            <Image
              source={{uri: partyData.logo.public_link}}
              style={styles.partyLogo}
              resizeMode="contain"
            />
          </View>

          <Txt medium style={styles.partyTitle}>
            {partyData.full_name}
          </Txt>

          {partyData.url && (
            <View style={styles.partyButton}>
              <ButtonDark
                text="Webseite"
                center
                onPress={() => {
                  Linking.openURL(partyData.url as string);
                }}
              />
            </View>
          )}
          {partyData.pivot.program !== null ? (
            <View style={styles.partyButton}>
              <ButtonDark
                center
                text={t('swiperResult.program')}
                onPress={() => {
                  Linking.openURL(partyData.pivot.program?.public_link as string);
                }}
              />
            </View>
          ) : (
            <>
              {partyData.pivot.program_link && (
                <View style={styles.partyButton}>
                  <ButtonDark
                    center
                    text={t('swiperResult.program')}
                    onPress={() => {
                      Linking.openURL(partyData.pivot.program_link as string);
                    }}
                  />
                </View>
              )}
            </>
          )}
        </View>

        <View>
          {election!.questions.map((question) => {
            const userAnswer = getAnswer(question.id);
            const partyAnswer = getPartyAnswer(question.id);

            if (!partyAnswer || !userAnswer) {
              return null;
            }

            return (
              <Box key={question.id}>
                {userAnswer.doubleWeight === true && (
                  <View style={styles.doubleWeighted}>
                    <View style={styles.doubleWeightedLabel}>
                      <Txt medium style={styles.doubleWeightedText}>
                        {t('swiper.doubleWeighted')}
                      </Txt>
                    </View>
                  </View>
                )}
                <Title mainBig style={styles.thesis}>
                  {question.thesis}
                </Title>

                {partyAnswer.reason ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (showReason === question.id) {
                          setReason(null);

                          return null;
                        }

                        setReason(question.id);
                      }}>
                      <Txt style={styles.reasonLink} medium>
                        {showReason === question.id
                          ? t('swiperResult.closeReasoning')
                          : t('swiperResult.readReasoning')}
                      </Txt>
                    </TouchableOpacity>
                    {showReason === question.id && (
                      <View style={styles.reason}>
                        <Txt style={styles.reasonText}>
                          {partyAnswer.reason}
                        </Txt>
                      </View>
                    )}
                  </>
                ) : (
                  <Txt medium style={styles.reasonLink}>
                    {t('swiperResult.noReason')}
                  </Txt>
                )}

                <View style={styles.answers}>
                  <View style={styles.answer}>
                    <Title h5dark uppercase>
                      {t('swiperResult.yourAnswer')}
                    </Title>
                    {userAnswer.answer === 0 ? (
                      <View style={styles.noneLabel}>
                        <Txt medium style={styles.labelText}>
                          {t('swiper.none')}
                        </Txt>
                      </View>
                    ) : null}
                    {userAnswer.answer === 1 ? (
                      <View style={styles.noLabel}>
                        <Txt medium style={styles.labelText}>
                          {t('swiper.no')}
                        </Txt>
                      </View>
                    ) : null}
                    {userAnswer.answer === 2 ? (
                      <View style={styles.yesLabel}>
                        <Txt medium style={styles.labelText}>
                          {t('swiper.yes')}
                        </Txt>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.answer}>
                    <Title h5dark uppercase>
                      {t('swiperResult.party')}
                    </Title>
                    {partyAnswer.answer === 0 ? (
                      <View style={styles.noneLabel}>
                        <Txt medium style={styles.labelText}>
                          {t('swiper.none')}
                        </Txt>
                      </View>
                    ) : null}
                    {partyAnswer.answer === 1 ? (
                      <View style={styles.noLabel}>
                        <Txt medium style={styles.labelText}>
                          {t('swiper.no')}
                        </Txt>
                      </View>
                    ) : null}
                    {partyAnswer.answer === 2 ? (
                      <View style={styles.yesLabel}>
                        <Txt medium style={styles.labelText}>
                          {t('swiper.yes')}
                        </Txt>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Box>
            );
          })}
        </View>
      </ScrollContainer>
    </Container>
  );
};

const {width} = Dimensions.get('window');

let questionsPadding = 30;

if (width < sm) {
  questionsPadding = 20;
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  party: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  partyLogoContainer: {
    marginTop: questionsPadding,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  partyLogo: {
    width: 200,
    height: 70,
  },
  partyButton: {
    width: '100%',
  },
  partyTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  doubleWeighted: {
    justifyContent: 'flex-start',
  },
  doubleWeightedLabel: {
    backgroundColor: '#E6E90F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 3,
  },
  doubleWeightedText: {
    color: '#000',
    lineHeight: 16,
    textAlign: 'center',
  },
  thesis: {
    fontSize: 16,
    lineHeight: 20,
    color: '#392F52',
  },
  reasonLink: {
    marginTop: 5,
    color: '#392F52',
    fontSize: 14,
    opacity: 0.9,
  },
  reason: {
    marginHorizontal: -25,
    paddingHorizontal: 25,
    paddingVertical: 25 - 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginTop: 15,
  },
  reasonText: {
    color: '#392f52',
    fontSize: 14,
    lineHeight: 20,
  },
  answers: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  answer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noneLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(60, 60, 60, 1)',
    borderRadius: 5,
    marginTop: 5,
  },
  yesLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#12a73b',
    borderRadius: 5,
    marginTop: 5,
  },
  noLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#b92727',
    borderRadius: 5,
    marginTop: 5,
  },
  labelText: {
    color: '#fff',
    fontSize: 14,
  },
});


export default SwiperCompareParty;
