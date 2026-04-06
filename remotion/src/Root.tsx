import { Composition } from "remotion";
import { TextRevealVideo } from "./compositions/TextRevealVideo";
import { QuoteCard } from "./compositions/QuoteCard";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TextReveal"
        component={TextRevealVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          lines: [
            "The difference between",
            "building features",
            "and running experiments",
            "is the difference between",
            "guessing and learning.",
          ],
          accentColor: "#6366F1",
          authorName: "Kiran Johns",
          authorHandle: "@thetronjohnson",
        }}
      />
      <Composition
        id="QuoteCard"
        component={QuoteCard}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          quote: "Shipping variants isn't growth.\nLearning something real is.",
          accentColor: "#6366F1",
          authorName: "Kiran Johns",
        }}
      />
    </>
  );
};
