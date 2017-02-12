import Alexa from 'alexa-sdk';

const {MIN_REPEAT, MAX_REPEAT} = process.env;

const CRAB_PHONEME = '<phoneme alphabet="x-sampa" ph="kr\\@`{b">Crab</phoneme>';
const MESSAGE = [
  `${CRAB_PHONEME} people.`,
  `${CRAB_PHONEME} people.`,
  `Taste like ${CRAB_PHONEME}.`,
  'Talk like people.'
].join(' ');

const repeatMessage = (quantity, accumulator = '') =>
  quantity > 0
    ? repeatMessage(quantity - 1, accumulator + `<p>${MESSAGE}</p>`)
    : accumulator;

const alexaHandlers = {
  Unhandled() {
    this.emit('CrabPeopleIntent');
  },

  CrabPeopleIntent() {
    const { slots } = this.event.request.intent || {};
    const quantity = (slots || {}).Quantity || { value: 0 };
    let repeat = quantity.value
      ? parseInt(quantity.value)
      : MIN_REPEAT;

    repeat = Math.min(Math.max(repeat, MIN_REPEAT), MAX_REPEAT);

    console.log(`Repeating the message ${repeat} time(s) of ${quantity.value} requested`);

    this.emit(':tell', repeatMessage(repeat));
  }
};

const handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(alexaHandlers);
  alexa.execute();
};

export { handler }
