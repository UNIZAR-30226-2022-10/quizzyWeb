export const tableroCoords = [
    [1820,1088,1614,1130,1451,1223,1372,1315,1337,1457,1380,1578,1465,1664,1614,1742,1799,1792,1977,1792,2204,1742,2340,1664,2418,1585,2475,1464,2439,1315,2368,1230,2197,1137,1991,1088],
    [1828,1086,1984,1086,2016,911,1792,908],
    [2020,908,1792,908,1749,730,2055,731],
    [1707,495,2106,495,2055,730,1756,730],
    [2363,1233,2594,1126,2652,1183,2693,1249,2437,1315],
    [2821,1016,2895,1086,2957,1182,2701,1248,2652,1181,2594,1124],
    [3117,872,3224,970,3311,1082,2965,1181,2899,1090,2821,1016],
    [2418,1583,2681,1654,2574,1768,2347,1662],
    [2681,1654,2944,1718,2795,1875,2567,1768],
    [2944,1723,3303,1814,3216,1913,3101,2028,2796,1880,2882,1805],
    [1832,1795,1973,1795,2016,1970,1797,1970],
    [2052,2145,2008,1970,1797,1970,1762,2145],
    [1758,2142,1898,2154,2046,2142,2096,2377,1890,2389,1704,2377],
    [1380,1583,1131,1654,1236,1768,1465,1662],
    [1122,1652,868,1722,1010,1875,1230,1768],
    [859,1727,1008,1885,710,2025,512,1811],
    [1365,1313,1447,1237,1216,1121,1113,1246],
    [1109,1242,1216,1121,988,1007,850,1176],
    [991,1010,690,865,498,1086,839,1171],
    [1657,261,2155,261,2106,501,1707,495],
    [2113,502,2157,266,2455,309,2350,528],
    [2347,531,2578,584,2731,374,2453,303],
    [2578,584,2731,374,2998,470,2779,654],
    [2780,659,2993,469,3212,581,2966,753],
    [3220,586,3323,652,3414,726,3117,870,3043,808,2965,755],
    [3121,874,3229,969,3311,1089,3661,998,3550,841,3418,730],
    [3314,1095,3662,995,3755,1173,3385,1230],
    [3420,1379,3797,1365,3755,1180,3392,1230],
    [3420,1536,3420,1386,3797,1372,3790,1543],
    [3413,1529,3797,1550,3740,1728,3378,1671],
    [3371,1671,3740,1728,3648,1906,3300,1813],
    [3105,2027,3212,1928,3303,1812,3649,1907,3562,2022,3402,2171],
    [3399,2176,3200,2304,2937,2133,3100,2026],
    [2930,2133,2752,2226,2965,2425,3193,2304],
    [2958,2425,2752,2226,2553,2304,2709,2517],
    [2329,2355,2437,2590,2700,2512,2546,2305],
    [2100,2384,2322,2347,2429,2577,2293,2602,2149,2614],
    [1898,2629,1651,2621,1704,2378,1894,2391,2096,2382,2145,2617],
    [1477,2349,1704,2380,1651,2613,1519,2605,1366,2576],
    [1259,2297,1473,2351,1370,2577,1222,2553,1090,2511],
    [1255,2297,1046,2223,837,2420,1095,2506],
    [1053,2225,864,2128,605,2301,837,2419],
    [702,2020,859,2128,605,2306,406,2166],
    [152,1902,508,1805,702,2015,400,2166],
    [60,1724,427,1670,503,1805,152,1902],
    [17,1540,389,1524,433,1670,55,1718],
    [8,1548,395,1525,385,1382,15,1352],
    [385,1379,419,1226,52,1172,5,1351],
    [141,992,493,1083,422,1226,52,1172],
    [140,991,388,719,693,869,496,1082],
    [591,584,846,757,696,865,391,719],
    [1039,658,846,757,591,584,825,462],
    [829,462,1080,373,1249,584,1039,655],
    [1361,302,1080,370,1249,587,1473,529],
    [1368,302,1656,265,1711,499,1470,533]
]

export const tableroMap =
{
    "name": "my-map",
    "areas": [
        {   "id": 0,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "white",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[0]
        },
        {   "id": 1,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[1]
        },
        {   "id": 2,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[2]
        },
        {   "id": 3,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[3]
        },
        {   "id": 4,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[4]
        },
        {   "id": 5,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[5]
        },
        {   "id": 6,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[6]
        },
        {   "id": 7,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[7]
        },
        {   "id": 8,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[8]
        },
        {   "id": 9,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[9]
        },
        {   "id": 10,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[10]
        },
        {   "id": 11,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[11]
        },
        {   "id": 12,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[12]
        },
        {   "id": 13,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[13]
        },
        {   "id": 14,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[14]
        },
        {   "id": 15,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[15]
        },
        {   "id": 16,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[16]
        },
        {   "id": 17,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[17]
        },
        {   "id": 18,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[18]
        },
        {   "id": 19,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[19]
        },
        {   "id": 20,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[20]
        },
        {   "id": 21,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[21]
        },
        {   "id": 22,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "white",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[22]
        },
        {   "id": 23,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[23]
        },
        {   "id": 24,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[24]
        },
        {   "id": 25,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[25]
        },
        {   "id": 26,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[26]
        },
        {   "id": 27,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[27]
        },
        {   "id": 28,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "white",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[28]
        },
        {   "id": 29,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[29]
        },
        {   "id": 30,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[30]
        },
        {   "id": 31,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[31]
        },
        {   "id": 32,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[32]
        },
        {   "id": 33,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":  tableroCoords[33]
        },
        {   "id": 34,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "white",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[34]
        },
        {   "id": 35,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[35]
        },
        {   "id": 36,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[36]
        },
        {   "id": 37,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[37]
        },
        {   "id": 38,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[38]
        },
        {   "id": 39,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[39]
        },
        {   "id": 40,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "white",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[40]
        },
        {   "id": 41,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[41]
        },
        {   "id": 42,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":tableroCoords[42]
        },
        {   "id": 43,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[43]
        },
        {   "id": 44,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[44]
        },
        {   "id": 45,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[45]
        },
        {   "id": 46,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "white",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[46]
        },
        {   "id": 47,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords":tableroCoords[47]
        },
        {   "id": 48,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "pink",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[48]
        },
        {   "id": 49,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "red",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[49]
        },
        {   "id": 50,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "orange",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[50]
        },
        {   "id": 51,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "green",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[51]
        },
        {   "id": 52,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "white",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[52]
        },
        {   "id": 53,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "yellow",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[53]
        },
        {   "id": 54,
            "shape": "poly",
            "preFillColor": "rgba(0,0,0,0.3)",
            "fillColor": "blue",
            "strokeColor": "white",
            "lineWidth": 6,
            "coords": tableroCoords[54]
        },
    ]
}