export default {
  port: 1337,
  dbURI: "mongodb://localhost:27017/typescript-express",
  saltWorkFactor: 10,
  accessTokenTtl: "10s",
  refreshTokenTtl: "1y",
  publicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/iFjRTmsCi5iWV+jMr7BAF1eY
otPfYjdZHQvuwE6bUhbafnhFuOd0fmA8LjxebF6RfvMai+cizK6ZJFo6eYI3Ku/z
yotS4ef0aPi38Et8jJECKwe5OA51s1b073kTnjcjajVlgVlRSSOhGPrBlaZEs2Jh
/qfozTJrpQBeQ+T3gQIDAQAB
-----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC/iFjRTmsCi5iWV+jMr7BAF1eYotPfYjdZHQvuwE6bUhbafnhF
uOd0fmA8LjxebF6RfvMai+cizK6ZJFo6eYI3Ku/zyotS4ef0aPi38Et8jJECKwe5
OA51s1b073kTnjcjajVlgVlRSSOhGPrBlaZEs2Jh/qfozTJrpQBeQ+T3gQIDAQAB
AoGARtI6zUIqzWkixczBtxXrnPdEm5rxrvLZNmlIJUMUjdgfvTDwdg91/hxQp1AN
YHi/yxre91zt3W9DzDql5mNRo0LHy/bP7xdyeTjNJCW78TB+C4+ke26qVcyZNEJw
d70u5C6j8rDHCb+w64lVsqkiydp6DJ+1D1RGpSB1OQXYqqUCQQDf+QdsdJoCurZ0
tots6Th5RnEupYPxGZdHpH6p39iBqxdfZoEVxF9Nl/BQUncQyFeibO2O/n5tftWW
/3O/ZmhPAkEA2uvH54SvWXivDPFmuQcGSAOmIMFhHd1WcLGjtjxm94CtG4efkPiX
RX93KhvaFkQ6nVM7OTpwbyAYrcV851XfLwJARYaQf2JSzLYZHXHtJgnftgXf7JME
ujsvctXlW+ZY1ye9QagYOiGTVAruVoDC5TrLuWgG9nSZ2nOc6hqyW5/2kQJBAKjT
I3pbTI6HDxfAIiOWUzW9+qNP/gD16+9ETqf+tLkxtk2ArYEy9BVYUyFaETkSrNEe
mpFri8Fm0yFPJx+PjWkCQQDHO/g8y7ikzLovuAKx94n4S3Xg6Kt8ZM+nploNs2S2
W7vphT/oEtkvFuIj23gU6wxLKvHwAFFRUj/etQpx0a8+
-----END RSA PRIVATE KEY-----`,
};
