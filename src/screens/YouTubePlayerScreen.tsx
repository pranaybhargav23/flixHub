import React, { useRef, useCallback, useState } from "react";
import { View, Text, Button } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRoute } from '@react-navigation/native';

 const moviesData = [
  { id: "92c2cde7-d740-443d-8929-010b46cb0305", title: "No Time to Die", youtubeId: 'BIhNsAtPbPI' },
  { id: "046084e1-a782-4086-b723-f98c5c57ebc0", title: "Shang‑Chi and the Legend of the Ten Rings", youtubeId: '8YjFbMbfXaQ' },
  { id: "c6ef2389-078a-4117-b2dd-1dee027e5e8e", title: "Dune", youtubeId: 'n9xhJrPXop4' },
  { id: "cb4abae8-4ea4-4ee0-8a4e-6ab2ecc6163d", title: "The Suicide Squad", youtubeId: 'eg5ciqQzmK0' },
  { id: "51b4602f-b0f2-4c81-98e0-a2a409b13926", title: "Venom: Let There Be Carnage", youtubeId: '-FmWuCgJmxo' },
  { id: "bc2d4a89-5696-40b5-b42b-8c2461d97f98", title: "Eternals", youtubeId: 'x_me3xsvDgk' },
  { id: "c415e483-f9a8-4f95-9317-7b173e0cd37d", title: "Army of Thieves", youtubeId: 'Ith2WetKXlg' },
  { id: "2ae6bc9a-1c7e-41ac-af62-772b2cf024a3", title: "The Harder They Fall", youtubeId: 'Poc55U2RPMw' },
  { id: "b81e7fd6-fc9e-4658-87c2-3b91ecb52170", title: "Halloween Kills", youtubeId: 'hL6R3HmQfPc' },
  { id: "e1d03456-b0c8-4576-8ce7-c532cdfd561e", title: "Twilight", youtubeId: 'QDRLSqm_WVg' },
  { id: "ef6b65e0-3fbf-4ad7-ae0e-25a478648e69", title: "Ghostbusters: Afterlife", youtubeId: 'ahZFCF--uRY' },
  { id: "258761da-3623-4988-8849-fc550d210f3e", title: "The Shawshank Redemption", youtubeId: 'PLl99DlL6b4' },
  { id: "4615093e-2f9c-4da5-aa14-364f2b0f9ff7", title: "The Godfather", youtubeId: 'UaVTIH8mujA' },
  { id: "3789dfd7-aef7-46a2-8478-e34f6818f41d", title: "Godzilla: King of the Monsters", youtubeId: 'QFxN2oDKk0E' },
  { id: "c204a652-2f82-49a6-9329-ff17fd3c0528", title: "Wolfwalkers", youtubeId: 'd_Z_tybgPgg' },
  { id: "0c84cca2-df59-471f-a46c-6219538ac343", title: "The Green Mile", youtubeId: 'Bg7epsq0OIQ' },
  { id: "b2f52f94-7391-460b-b8d2-4b40bc6a7e1e", title: "Frozen II", youtubeId: 'Zi4LMpSDccc' },
  { id: "0cdbd71f-a03d-45e7-aa2c-db4ed14f8f0a", title: "Ice Age", youtubeId: 'i4noiCRJRoE' },
  { id: "c04a2fc5-8e74-450f-a26d-88590e5ee0be", title: "The Godfather: Part II", youtubeId: '9O1Iy9od7-A' },
  { id: "784727ba-3a25-4652-8f7e-26dc20d0a5f9", title: "Pulp Fiction", youtubeId: 's7EdQ4FqbhY' },
  { id: "efb33428-5527-44d0-a713-1aeef4d56968", title: "Death Proof", youtubeId: 'EAPy76vxF5s' },
  { id: "6de4cbcc-b24c-4833-9314-280998e4a851", title: "Clifford", youtubeId: '4zH5iYM4wJo' },
  { id: "33119fe5-3966-4bba-b98c-10b241ffc9f8", title: "Titanic", youtubeId: 'kVrqfYjkTdQ' },
  { id: "cfdd2370-ab67-4e0e-99f9-3014cb532a17", title: "Avatar", youtubeId: '5PSNL1qE6VY' },
  { id: "09f01b09-2ae9-4a9c-aa07-7d17277b920a", title: "A Few Good Men", youtubeId: 'iIaAL7JTEgE' },
  { id: "828f0c17-3f21-4e34-9671-54dfb66fcac9", title: "Squid Game", youtubeId: 'oqxAJKy0ii4' },
  { id: "978d6878-64a8-4467-8b58-d8e3b13a5501", title: "The Pursuit of Happyness", youtubeId: 'DMOBlEcRuw8' },
  { id: "61a15a42-4443-4c83-b7c3-c7aded428ec7", title: "King Richard", youtubeId: 'BKP_0z52ZAw' },
  { id: "82846610-9daa-4184-b3eb-b2825bad739a", title: "Dexter: New Blood", youtubeId: 'mzUx1hyL-yk' },
  { id: "9d2fdd4b-948a-4258-aa75-953612298d4d", title: "Riverdale", youtubeId: 'HxtLlByaYTc' },
  { id: "320dee56-fdb2-40cf-8df8-92b251bd781f", title: "Venom", youtubeId: 'u9Mv98Gr5pY' },
  { id: "97c8bed0-1ee7-49c3-a95f-7619ff43f7ec", title: "Snake Eyes: G.I. Joe Origins", youtubeId: 'MpNhqk0SXys' },
  { id: "69b533f3-1d6b-49b0-9bfd-a2c665c366e8", title: "The Addams Family 2", youtubeId: 'Kd82bSBDE84' },
  { id: "b2872586-3e64-4fc0-a244-f21c2e62fb37", title: "Luca", youtubeId: 'mYfJxlgR2jw' },
  { id: "d53a2c0b-c3cc-4ed6-85a0-6ebf9b3ba79e", title: "The Amazing Spider‑Man", youtubeId: '-tnxzJ0SSOw' },
  { id: "284a2caa-59d4-46b4-88bc-31a0eb07f622", title: "The Boss Baby: Family Business", youtubeId: 'QPzy8Ckza08' },
  { id: "bec46af0-11d9-495b-91b1-0d5793854bc2", title: "Jungle Cruise", youtubeId: 'f_HvoipFcA8' },
  { id: "e0928596-9d33-4fe5-9db6-1533dd3e6cc5", title: "Resident Evil: Welcome to Raccoon City", youtubeId: '4q6UGCyHZCI' },
  { id: "43d2c5cb-fa5e-4930-bd90-080ba27be393", title: "Spider‑Man: Far From Home", youtubeId: 'Nt9L1jCKGnE' },
  { id: "75a6953e-fc4f-494c-bc8a-58e05b0f79fa", title: "Free Guy", youtubeId: 'X2m-08cOAbc' },
  { id: "a9f97e39-c6a8-4e01-ad3c-56d5b09d1107", title: "Black Widow", youtubeId: 'ybji16u608U' },
  { id: "3511b690-4b8c-479e-bbe7-57ba9a30e2b8", title: "PAW Patrol: The Movie", youtubeId: 'LRMTr2VZcr8' },
  { id: "6bbf5f12-c65e-408c-9bc3-3079202a238c", title: "Ripper Untold", youtubeId: 'WH2Bdsya0GU' },
  { id: "c9bc0e64-c6fc-46aa-bbac-08bc99158980", title: "The Protégé", youtubeId: 'fSqa0a3mGk8' },
  { id: "d06939e9-02ed-47e3-958f-94d2a64bb508", title: "Gunpowder Milkshake", youtubeId: 'yxuAroBqt2c' },
  { id: "8c288a68-9e27-422a-99a8-022a33ed0517", title: "Narnia", youtubeId: 'usEkWtuNn-w' },
  { id: "75381621-22f5-419a-a4dc-bf152b75fa42", title: "Dragon Fury", youtubeId: 'uJ7ImjaB9d0' },
  { id: "c7b0404e-877d-47e6-bc0f-d84b61cffdaa", title: "Spider‑Man", youtubeId: 't06RUxPbp_c' },
  { id: "d5ece2d3-b3a2-416c-9b9b-4f86bf271f83", title: "Space Jam: A New Legacy", youtubeId: 'olXYZOsXw_o' },
  { id: "5f3ebcb1-eab4-4a57-ac8e-947e652fe6d1", title: "Mortal Kombat", youtubeId: 'NYH2sLid0Zc' },
  { id: "525a5318-04de-46f4-b490-3a30d3df9cdb", title: "The Vault", youtubeId: 'L41IJiageyg' },
  { id: "feafc598-6835-4c5d-9a22-d30cccce7340", title: "Cruella", youtubeId: 'gmRKv7n2If8' },
  { id: "d68bc6ac-343f-4fca-ad74-bf990a5ebabf", title: "The Tomorrow War", youtubeId: 'RQjEbkV-9ZM' },
  { id: "84282117-af72-418a-bbbf-63a56b38ddad", title: "Zack Snyder's Justice League", youtubeId: 'ui37YKQ9AC4' },
  { id: "c1933919-3b5e-4420-9889-27918a14b3f1", title: "Infinite", youtubeId: '_WWEOCQGxSw' },
  { id: "9e32fdb4-3fcc-441a-91b7-21291fbbd4f3", title: "Cosmic Sin", youtubeId: '9HTWDnKs6hA' },
  { id: "44794586-46f6-4b7a-8a92-79a808f8452f", title: "Demonic", youtubeId: 'EYXLKC5xd7Q' },
  { id: "b844639b-d44f-4c9b-aba1-313b810884b0", title: "Cast Away", youtubeId: 'qGuOZPwLayY' },
  { id: "41f68550-523a-4c90-9921-9bbd60b2d6da", title: "Red Notice", youtubeId: 'Pj0wz7zu3Ms' },
  { id: "0c8a387f-b92c-4729-90c3-9caf3fe81a9b", title: "Godzilla vs. Kong", youtubeId: 'odM92ap8_c0' }
];

export default function YouTubePlayerScreen({route}: { route: any }) {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const { movieId } = route.params;
  console.log(movieId,"1222222222222")

  // Find the movie and get its youtubeId
  const movie = moviesData.find(m => m.id === movieId);
  const videoId = movie ? movie.youtubeId : undefined;

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") setPlaying(false);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#000" }}>
      <YoutubePlayer
        ref={playerRef}
        height={230}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        onFullScreenChange={(isFull: boolean) => console.log("Fullscreen:", isFull)}
        // Optional, pass down to WebView if needed:
        // webViewProps={{ allowsFullscreenVideo: true, allowsInlineMediaPlayback: true }}
      />

      <View style={{ height: 12 }} />
      {/* <Button
        title={playing ? "Pause" : "Play"}
        onPress={() => setPlaying((p) => !p)}
      /> */}
    </View>
  );
}
