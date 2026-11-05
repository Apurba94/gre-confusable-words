/* Confusable Words: pairs that test takers mix up, such as flout and flaunt, practised in sentences. */
(function () {
  'use strict';
  const items = (pairs, n, seed) => {
    const r = SK.rng(seed), out = [];
    for (const p of SK.shuffle(r, pairs)) {
      for (const [s, right, wrongW, d] of [[p.sa, p.a, p.b, p.ad], [p.sb, p.b, p.a, p.bd]]) {
        out.push(SK.shuffleItem(r, { id: 'cf-' + p.id + '-' + right, type: 'single', topic: p.a + ' / ' + p.b, stem: s, choices: [right, wrongW], answer: 0,
          explanation: '**' + p.a + '**: ' + p.ad + '. **' + p.b + '**: ' + p.bd + '. Here the sentence needs *' + right + '* (' + d + ').' }));
      }
      if (out.length >= n) break;
    }
    return SK.shuffle(r, out).slice(0, n);
  };
  const App = {
    about: 'Thirty pairs of words that look or sound alike but mean different things, from flout and flaunt to venal and venial. Each pair comes with two sentences, one for each word, so you learn the difference in use, not just in a list.',
    how: ['Read the pairs in **Pairs**.', 'In **Quiz**, choose the word that fits each sentence.', 'Learn pairs you miss with **Cards**.'],
    tabs: [
      { id: 'quiz', label: 'Quiz', render(el, ctx) { SK.quizStarter(el, { title: 'Which word fits?', sizes: [10, 20, 40, 60], make: (t, n, s) => items(ctx.data.confusables, n, s), seconds: (n) => n * 15 }); } },
      { id: 'pairs', label: 'Pairs', render(el, ctx) { el.appendChild(SK.card('Pairs', SK.table(['Word', 'Meaning', 'Word', 'Meaning'], ctx.data.confusables.map((p) => [SK.h('strong', { text: p.a }), p.ad, SK.h('strong', { text: p.b }), p.bd])))); } },
      SK.cardsTab('cards', 'Cards', (ctx) => ctx.data.confusables.flatMap((p) => [{ id: p.id + 'a', front: p.a, back: p.ad, extra: 'Not ' + p.b + ' (' + p.bd + ')', tag: '' }, { id: p.id + 'b', front: p.b, back: p.bd, extra: 'Not ' + p.a + ' (' + p.ad + ')', tag: '' }])),
    ],
    checks: {
      'both sentences of every pair become a question with the right word': (data, assert) => {
        const all = items(data.confusables, 1000, 3);
        assert.equal(all.length, data.confusables.length * 2);
        for (const it of all) { assert.deepEqual(SK.validateItem(it), []); assert.ok(it.stem.includes('_____')); }
      },
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
