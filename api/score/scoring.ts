export const calculateScore = (measures: any, measuresAnswers: Map<string, number>, candidateAnswer: any) => {

    const questionsMeasures = Object.entries(candidateAnswer.answers).map(([questionId, questionAnswer]: any) => {
        const answers = getAnswersFromQuestion(questionAnswer)

        const answerMeasureResult = measures.map((measure: any) => {
            const result = answers.reduce((answerSum: any, a: any) => {
                const key = generateMapKey({
                    measureId: measure.id,
                    surveyId: candidateAnswer.surveyId,
                    questionId,
                    answerId: a.id   
                })

                return {
                    sum: measuresAnswers.has(key) ? answerSum.sum + (measuresAnswers.get(key)) : answerSum.sum,
                    nbAnswersWithSameMeasureImpact: measuresAnswers.has(key) ? answerSum.nbAnswersWithSameMeasureImpact + 1 : answerSum.nbAnswersWithSameMeasureImpact
                }
            }, { sum: 0, nbAnswersWithSameMeasureImpact: 0 })

            return {
                measureId: measure.id,
                mesureLabel: measure.label,
                factor: measure.factor,
                indicator: measure.indicator,
                score: (result.sum * measure.factor) / (result.nbAnswersWithSameMeasureImpact > 0 ? result.nbAnswersWithSameMeasureImpact : 1),
                max: measure.max * measure.factor
            }
        })

        return { questionId, measures: answerMeasureResult }
    }).flat()

    const allQuestionsAnswersMeasures = questionsMeasures.map(q => q.measures).flat()
    
    const scoreByMeasure = Array.from(allQuestionsAnswersMeasures.reduce((scoresMap, questionMeasure) => {

        const scoreValue = scoresMap.get(questionMeasure.mesureLabel)
        if (!scoreValue) {
            scoresMap.set(questionMeasure.mesureLabel, { ...questionMeasure })
        } else {
            scoresMap.set(questionMeasure.mesureLabel, { ...scoreValue, score: scoreValue.score + + questionMeasure.score }) 
        }

        return scoresMap
    }, new Map())).map(([_key, value]: any) => value)

    const scoreByIndicator = scoreByMeasure.reduce((score, scoreMeasure) => {
        if (!score[scoreMeasure.indicator]) {
            score[scoreMeasure.indicator] = {
                score: scoreMeasure.score,
                max: scoreMeasure.max
            }
        } else {
            score[scoreMeasure.indicator].score = score[scoreMeasure.indicator].score + scoreMeasure.score
            score[scoreMeasure.indicator].max = score[scoreMeasure.indicator].max + scoreMeasure.max
        }
        return score
    }, {})

    const grades = Object.entries(scoreByIndicator).reduce((agg: any, [key, value]: any) => {
        agg[key] = Number(Number(value.score / value.max).toPrecision(4))
        return agg
    }, {})

    return { grades, questionsMeasures, scoreByMeasure }
}

const getAnswersFromQuestion = (question: any) => {
    let answers = [] as any
    // In the 1st version of the survey we can't have multiple answer, 
    // that's why we deal with the answers attribute
    // it should be not necessary anymore when the data will be cleaned
    if (question.answer) {
        if (question.answer.answers) {
            answers = question.answer.answers
        } else {
            answers = [question.answer]
        }
    }

    return answers
}

export const generateMeasuresAnswersMap = (measuresAnswers: any[]) => new Map(measuresAnswers.map((m: any) => ([generateMapKey(m), m.score]))) as Map<string, number>

const generateMapKey = ({ measureId, surveyId, questionId, answerId }: { measureId: string, surveyId: string, questionId: string, answerId: string }) => `${measureId}-${surveyId}-${questionId}-${answerId}`