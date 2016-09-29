/**
 * Created by Mortoni on 19/11/13.
 *
 * configuration data
 */
module.exports = {
  port: 3000,
  polltime: 10,
  timecount: 60,
  databaseURI : "localhost:27017/logger",
  collections : ["messages", "diffs"],
  feeds :  [
        { type: "xml", url: 'http://scoring.mstworld.tv/xml/rydercup.xml' },
        { type: "json", url: 'http://uatd.365dm.com/api/score-centre/v1/golf/leaderboard/1484' }
        ]
};