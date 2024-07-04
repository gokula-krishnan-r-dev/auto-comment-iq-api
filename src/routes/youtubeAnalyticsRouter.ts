const { Router } = require("express");
const axios = require("axios");
const { DateTime } = require("luxon");

const youtubeanalyticsRouter = Router();

youtubeanalyticsRouter.get("/", async (req, res) => {
  try {
    const { startDate, endDate, hero, filter, dimensions, sort } = req.query;
    if (!req.headers.authorization) {
      console.log(req.headers.authorization);
      res.status(401).json({ error: "Authorization header is required" });
    }

    if (!startDate || !endDate || !hero) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }
    const values = await fetchData(
      startDate,
      endDate,
      req.headers.authorization,
      hero,
      filter,
      dimensions,
      sort
    );

    res.json({ values });
    // res.json({
    //   values: {
    //     subscribersGained: [
    //       {
    //         date: "Jan 01 2024",
    //         subscribersGained: 0,
    //         id: 0.0773025086508623,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         subscribersGained: 0,
    //         id: 0.8262597457583245,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         subscribersGained: 3,
    //         id: 0.7795191514530757,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         subscribersGained: 0,
    //         id: 0.48114585664647347,
    //       },
    //       {
    //         date: "May 01 2024",
    //         subscribersGained: 0,
    //         id: 0.010660196449082449,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         subscribersGained: 0,
    //         id: 0.4665224362064544,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         subscribersGained: 0,
    //         id: 0.37807536598742364,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         subscribersGained: 0,
    //         id: 0.07782239505413102,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         subscribersGained: 0,
    //         id: 0.5307594500249055,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         subscribersGained: 0,
    //         id: 0.6129012598055321,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         subscribersGained: 0,
    //         id: 0.38769080791704247,
    //       },
    //     ],
    //     subscribersGained_total_count: 3,
    //     subscribersGained_percentageChange: -99.95521719659651,
    //     views: [
    //       {
    //         date: "Jan 01 2024",
    //         views: 41,
    //         id: 0.05090795150693328,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         views: 357,
    //         id: 0.37496291212700683,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         views: 156,
    //         id: 0.29285918143540046,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         views: 25,
    //         id: 0.5520114551305628,
    //       },
    //       {
    //         date: "May 01 2024",
    //         views: 0,
    //         id: 0.7973939616165997,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         views: 0,
    //         id: 0.08347383499598937,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         views: 0,
    //         id: 0.3866348840493703,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         views: 0,
    //         id: 0.8688376857145081,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         views: 0,
    //         id: 0.4975353325235996,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         views: 0,
    //         id: 0.6708107472583933,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         views: 0,
    //         id: 0.14303027982765926,
    //       },
    //     ],
    //     views_total_count: 579,
    //     views_percentageChange: -91.35691894312585,
    //     likes: [
    //       {
    //         date: "Jan 01 2024",
    //         likes: 3,
    //         id: 0.8890501546697491,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         likes: 0,
    //         id: 0.4051079272580227,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         likes: 2,
    //         id: 0.6192263793297792,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         likes: 0,
    //         id: 0.8565677707195518,
    //       },
    //       {
    //         date: "May 01 2024",
    //         likes: 0,
    //         id: 0.10894378249818382,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         likes: 0,
    //         id: 0.498967684569245,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         likes: 0,
    //         id: 0.489275292353047,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         likes: 0,
    //         id: 0.2574671495511802,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         likes: 0,
    //         id: 0.14997082023645625,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         likes: 0,
    //         id: 0.7127386604680823,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         likes: 0,
    //         id: 0.37544616923968976,
    //       },
    //     ],
    //     likes_total_count: 5,
    //     likes_percentageChange: -99.9253619943275,
    //     comments: [
    //       {
    //         date: "Jan 01 2024",
    //         comments: 13,
    //         id: 0.4529054311520504,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         comments: 15,
    //         id: 0.4195062517449277,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         comments: 26,
    //         id: 0.9152514542428658,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         comments: 0,
    //         id: 0.5551274898745344,
    //       },
    //       {
    //         date: "May 01 2024",
    //         comments: 0,
    //         id: 0.04598889090266378,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         comments: 0,
    //         id: 0.7329158705402572,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         comments: 0,
    //         id: 0.7475402738140926,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         comments: 0,
    //         id: 0.9991237161736197,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         comments: 0,
    //         id: 0.012098095265253628,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         comments: 0,
    //         id: 0.1038699419398672,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         comments: 0,
    //         id: 0.625322126100994,
    //       },
    //     ],
    //     comments_total_count: 54,
    //     comments_percentageChange: -99.19390953873713,
    //     estimatedMinutesWatched: [
    //       {
    //         date: "Jan 01 2024",
    //         estimatedMinutesWatched: 6,
    //         id: 0.0675820251825332,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         estimatedMinutesWatched: 39,
    //         id: 0.8711416320372434,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         estimatedMinutesWatched: 25,
    //         id: 0.7916151994129412,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         estimatedMinutesWatched: 3,
    //         id: 0.8343925812471229,
    //       },
    //       {
    //         date: "May 01 2024",
    //         estimatedMinutesWatched: 0,
    //         id: 0.4734337244555902,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         estimatedMinutesWatched: 0,
    //         id: 0.7448139077979476,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         estimatedMinutesWatched: 0,
    //         id: 0.6507919589615103,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         estimatedMinutesWatched: 0,
    //         id: 0.6344150658536489,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         estimatedMinutesWatched: 0,
    //         id: 0.9637890209796838,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         estimatedMinutesWatched: 0,
    //         id: 0.11086840333264991,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         estimatedMinutesWatched: 0,
    //         id: 0.9995750347132799,
    //       },
    //     ],
    //     estimatedMinutesWatched_total_count: 73,
    //     estimatedMinutesWatched_percentageChange: -98.91028511718167,
    //     averageViewDuration: [
    //       {
    //         date: "Jan 01 2024",
    //         averageViewDuration: 9,
    //         id: 0.5066881601451652,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         averageViewDuration: 6,
    //         id: 0.11528778882782542,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         averageViewDuration: 9,
    //         id: 0.7299269525508156,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         averageViewDuration: 7,
    //         id: 0.06627739394711085,
    //       },
    //       {
    //         date: "May 01 2024",
    //         averageViewDuration: 0,
    //         id: 0.8058345145060617,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         averageViewDuration: 0,
    //         id: 0.905875664141488,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         averageViewDuration: 0,
    //         id: 0.6330029648854538,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         averageViewDuration: 0,
    //         id: 0.5634085040998833,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         averageViewDuration: 0,
    //         id: 0.5696813860847152,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         averageViewDuration: 0,
    //         id: 0.8905612402143197,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         averageViewDuration: 0,
    //         id: 0.1985270521614615,
    //       },
    //     ],
    //     averageViewDuration_total_count: 31,
    //     averageViewDuration_percentageChange: -99.53724436483057,
    //     shares: [
    //       {
    //         date: "Jan 01 2024",
    //         shares: 1,
    //         id: 0.49717664859834554,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         shares: 0,
    //         id: 0.9420297510750963,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         shares: 2,
    //         id: 0.7528063187871998,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         shares: 0,
    //         id: 0.7115876595727149,
    //       },
    //       {
    //         date: "May 01 2024",
    //         shares: 0,
    //         id: 0.8775178662893524,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         shares: 0,
    //         id: 0.5569782205220293,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         shares: 0,
    //         id: 0.31049581385570524,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         shares: 0,
    //         id: 0.47518676422861095,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         shares: 0,
    //         id: 0.746328591797881,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         shares: 0,
    //         id: 0.3983479811139383,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         shares: 0,
    //         id: 0.9582800266127911,
    //       },
    //     ],
    //     shares_total_count: 3,
    //     shares_percentageChange: -99.95521719659651,
    //     dislikes: [
    //       {
    //         date: "Jan 01 2024",
    //         dislikes: 0,
    //         id: 0.08311660509462238,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         dislikes: 0,
    //         id: 0.553858033017907,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         dislikes: 0,
    //         id: 0.12315866109451346,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         dislikes: 0,
    //         id: 0.94144979144328,
    //       },
    //       {
    //         date: "May 01 2024",
    //         dislikes: 0,
    //         id: 0.309013513256978,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         dislikes: 0,
    //         id: 0.14692541446321639,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         dislikes: 0,
    //         id: 0.5837740862727516,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         dislikes: 0,
    //         id: 0.07022107483936058,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         dislikes: 0,
    //         id: 0.7935607464289973,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         dislikes: 0,
    //         id: 0.10116361384218497,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         dislikes: 0,
    //         id: 0.42818636290750156,
    //       },
    //     ],
    //     dislikes_total_count: 0,
    //     dislikes_percentageChange: -100,
    //     annotationClickThroughRate: [
    //       {
    //         date: "Jan 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.33527228289560407,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.42363722591908637,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.5540294855532117,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.8719774161050777,
    //       },
    //       {
    //         date: "May 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.10276499339953338,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.7691463977781212,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.06382355797458739,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.9991907700894982,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.5812227418090739,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.7469926760285235,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         annotationClickThroughRate: 0,
    //         id: 0.936628553789695,
    //       },
    //     ],
    //     annotationClickThroughRate_total_count: 0,
    //     annotationClickThroughRate_percentageChange: -100,
    //     annotationCloseRate: [
    //       {
    //         date: "Jan 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.43561675741615735,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.7009961092143504,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.09522895003419984,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.41436193894582796,
    //       },
    //       {
    //         date: "May 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.9082842222414123,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.46659602132338995,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.6873112257299174,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.3942120965360292,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.7410561318962556,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.5828326422206589,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         annotationCloseRate: 0,
    //         id: 0.7269457324264734,
    //       },
    //     ],
    //     annotationCloseRate_total_count: 0,
    //     annotationCloseRate_percentageChange: -100,
    //     annotationImpressions: [
    //       {
    //         date: "Jan 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.27116552060968724,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.4493835334270322,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.30868080063006964,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.5239000393354287,
    //       },
    //       {
    //         date: "May 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.6182349064183894,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.6153318905975516,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.44155775950120235,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.8459010264169289,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.8031165278701367,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.8305670086559398,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         annotationImpressions: 0,
    //         id: 0.12051755242903517,
    //       },
    //     ],
    //     annotationImpressions_total_count: 0,
    //     annotationImpressions_percentageChange: -100,
    //     viewsPerPlaylistStart: [
    //       {
    //         date: "Jan 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.6751549013030225,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.24867604068907334,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.38231059374794985,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.31183833383249127,
    //       },
    //       {
    //         date: "May 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.9826540343436618,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.3824083419380693,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.4960922456998411,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.5798807713500946,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.33770895716988014,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.39921028874212094,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         viewsPerPlaylistStart: 0,
    //         id: 0.39764889741575926,
    //       },
    //     ],
    //     viewsPerPlaylistStart_total_count: 0,
    //     viewsPerPlaylistStart_percentageChange: -100,
    //     averageTimeInPlaylist: [
    //       {
    //         date: "Jan 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.8065963278324606,
    //       },
    //       {
    //         date: "Feb 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.5033764482135599,
    //       },
    //       {
    //         date: "Mar 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.4356217046975601,
    //       },
    //       {
    //         date: "Apr 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.8892406787277745,
    //       },
    //       {
    //         date: "May 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.5553963536527846,
    //       },
    //       {
    //         date: "Jun 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.9737106486255871,
    //       },
    //       {
    //         date: "Jul 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.2967576335888358,
    //       },
    //       {
    //         date: "Aug 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.3645628412306572,
    //       },
    //       {
    //         date: "Sep 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.8132683125097644,
    //       },
    //       {
    //         date: "Oct 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.42442037758996864,
    //       },
    //       {
    //         date: "Nov 01 2024",
    //         averageTimeInPlaylist: 0,
    //         id: 0.7423034297195377,
    //       },
    //     ],
    //     averageTimeInPlaylist_total_count: 0,
    //     averageTimeInPlaylist_percentageChange: -100,
    //   },
    // });
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data?.error || error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function calculatePercentageChange(values) {
  const totalValues = values.length;
  if (totalValues === 0) return null; // Return null if there are no values

  const totalSum = values.reduce((sum, entry) => sum + entry, 0);
  const averageValue = totalSum / totalValues;

  // Calculate percentage change
  const percentageChange = ((averageValue - 609) / 609) * 100; // 609 is the reference value

  return percentageChange;
}

async function fetchData(
  startDate,
  endDate,
  authorizationHeader,
  hero,
  filter,
  dimensions,
  sort
) {
  const metrics = [
    { name: "subscribersGained", data: [] },
    { name: "views", data: [] },
    { name: "likes", data: [] },
    { name: "comments", data: [] },
    { name: "estimatedMinutesWatched", data: [] },
    { name: "averageViewDuration", data: [] },
    { name: "shares", data: [] },
    { name: "dislikes", data: [] },
    { name: "annotationClickThroughRate", data: [] },
    { name: "annotationCloseRate", data: [] },
    { name: "annotationImpressions", data: [] },
    {
      name: "viewsPerPlaylistStart",
      data: [],
      total_count: 0,
    },
    { name: "averageTimeInPlaylist", data: [] },
  ];

  let currentDate = DateTime.fromISO(startDate);
  const endDateTime = DateTime.fromISO(endDate);

  while (currentDate < endDateTime) {
    const formattedDate = currentDate.toFormat("yyyy-MM-dd");
    const showingFormattedDate = currentDate.toFormat("LLL dd yyyy");

    const nextMonthDate = currentDate
      .plus({ months: 1 })
      .toFormat("yyyy-MM-dd");

    const promises = metrics.map(async (metric) => {
      const data = await fetchYouTubeAnalyticsData(
        formattedDate,
        nextMonthDate,
        authorizationHeader,
        hero,
        filter,
        dimensions,
        sort
      );

      const value =
        data?.rows?.[0]?.[
          metrics.findIndex((item) => item.name === metric.name)
        ] || 0;

      metric.data.push({
        date: showingFormattedDate,
        [metric.name]: value,
        id: Math.random(), // Assign a random value to the id property
      });
    });

    await Promise.all(promises);

    currentDate = currentDate.plus({ months: 1 });
  }

  const result = {};
  metrics.forEach((metric) => {
    result[metric.name] = metric.data;
    result[metric.name + "_total_count"] = metric.data.reduce(
      (sum, entry) => sum + entry[metric.name],
      0
    );

    // Extract values for percentage change calculation
    const valuesForPercentageChange = metric.data.map(
      (entry) => entry[metric.name]
    );

    // Calculate percentage change
    result[metric.name + "_percentageChange"] = calculatePercentageChange(
      valuesForPercentageChange
    );
  });

  return result;
}

async function fetchYouTubeAnalyticsData(
  startDate,
  endDate,
  authorizationHeader,
  hero,
  filter,
  dimensions,
  sort
) {
  const url = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel%3D%3DMINE&metrics=${hero}&startDate=${startDate}&endDate=${endDate}${
    filter ? `&filters=${filter}` : ""
  } ${dimensions ? `&dimensions=${dimensions}` : ""}${
    sort ? `&sort=-${hero}` : ""
  }`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${authorizationHeader?.split(" ")?.[1]}`,
    },
  });
  return response.data;
}

youtubeanalyticsRouter.post("/competitors", async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(400).json({ error: "Channel IDs are required" });
    }

    const channelIds = Array.isArray(ids) ? ids : [ids];

    const competitorsData = await Promise.all(
      channelIds.map(async (id) => {
        return await fetchCompetitorsData(id);
      })
    );

    res.json(competitorsData);
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data?.error || error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchCompetitorsData(id: string) {
  try {
    const url = `https://mixerno.space/api/youtube-channel-counter/user/${id.replace(
      /"/g,
      ""
    )}`;
    const response = await axios.get(url);
    const { counts, user } = response.data;

    // Transform data into chartData format
    const chartData = {
      t: Date.now(), // Assuming current timestamp
      counts: counts.map((item) => ({
        value: item.value,
        [item.value]: item.count,
      })),
      user: user.map((item) => ({
        value: item.value,
        count: item.count,
      })),
    };

    return chartData;
  } catch (error) {
    console.error("Error fetching competitor data:", error.message);
    return null;
  }
}

youtubeanalyticsRouter.get("/search/channel/:q", async (req, res) => {
  try {
    const { q } = req.params;
    if (!q) {
      return res.status(400).json({ error: "Query is required" });
    }

    const response = await fetchChannelData(q);
    res.json(response);
  } catch (error) {
    console.error(
      "Error fetching channel data:",
      error.response?.data?.error || error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchChannelData(query: string) {
  const url = `https://mixerno.space/api/youtube-channel-counter/search/${query}`;
  const response = await axios.get(url);
  return response.data;
}

export default youtubeanalyticsRouter;
