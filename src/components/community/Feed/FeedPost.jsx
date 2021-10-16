import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "antd";
import Avatar from "../../common/Avatar";
import PostButton from "./PostButton";
import axios from "axios";
import { HiOutlineChat, HiOutlineHeart, HiOutlineShare } from "react-icons/hi";
import UserContainer from "../../../utils/state/userContainer";
import Link from "next/link";
import FeedLoading from "../../community/Feed/FeedLoading";
import * as months from "../../../utils/data/months.json";
import { AnimatePresence, motion } from "framer-motion";

const FeedPostContainer = styled.div`
  display: flex;
  flex-direction: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  border-bottom: 1px solid #d4d4d480;
  transition: 0.2s all ease-in-out;
  :hover {
    cursor: pointer;
    background-color: #d4d4d440;
  }

  }
`;
const FeedPostWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const FeedContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
  width: calc(100% - 64px);
`;

const FeedPostInfoWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const PostAuthor = styled.p`
  font-size: 1.1em;
  font-weight: 700;
  margin-right: 4px;
  color: #000;
`;

const PostUsername = styled.p`
  font-size: 1.1em;
  font-weight: 400;
  color: #00000080;
`;

const Content = styled.p`
  font-size: 1.2em;
  font-weight: 400;
  margin-top: 4px;
  white-space: pre-line;
  color: #000;
`;

const ActionBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  margin-top: 24px;
  margin-left: -12px;
`;

const Icon = styled.div`
  padding: 4px;
  border-radius: 36px;

  height: 36px;
  width: 36px;
  transition: 0.2s all ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    color: ${(p) => (p.liked ? `${p.hoverColor}90` : "#00000080")} !important;
    fill: ${(p) => (p.liked ? `${p.hoverColor}90` : "")} !important;
  }

  :hover {
    cursor: pointer;
    background: ${(p) => `${p.hoverColor}20`};

    svg {
      color: ${(p) => `${p.hoverColor}90`} !important;
    }
  }
`;

const ClickContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 48px;
`;

const Data = styled.p`
  font-size: 1em;
  font-weight: 600;
  color: #00000080;
`;

const ReplyTo = styled.p`
  font-size: 1em;
  font-weight: 500;
  color: #00000080;
`;

const formatDate = (date) => {
  let dateOb = new Date(date);
  var diffMs = new Date() - dateOb; // milliseconds between now & Christmas
  var diffDays = Math.floor(diffMs / 86400000); // days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

  if (diffDays > 0) {
    return `${months[dateOb.getMonth()]} ${dateOb.getDate()}`;
  } else if (diffHrs > 0) {
    return `${diffHrs}h`;
  } else if (diffMins > 0) {
    return `${diffMins}m`;
  }
};

const FeedPost = ({ initialPost, redirect }) => {
  const { user } = UserContainer.useContainer();
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [time, setTime] = useState(formatDate(initialPost.createdAt));

  useEffect(async () => {
    if (redirect) {
      const newPost = await axios.get("/api/community/get_post", {
        params: {
          uid: initialPost.id,
        },
      });
      const tempPost = newPost.data;

      if (!tempPost) {
        return;
      }

      if (tempPost.replyTo.length > 0) {
        const author = await axios.get("/api/user/get_user", {
          params: {
            id: tempPost.replyTo[0].authorId,
          },
        });

        if (!author) {
          return;
        }

        tempPost.replyTo[0].author = author.data;
      }

      setPost(tempPost);
      setLikes(tempPost.likes.length);
      setLiked(tempPost.likes.some((e) => e.id === user.id));
      setLoading(false);
    } else {
      const tempPost = post;
      if (tempPost.replyTo ? tempPost.replyTo.length > 0 : false) {
        const author = await axios.get("/api/user/get_user", {
          params: {
            id: tempPost.replyTo[0].authorId,
          },
        });

        if (!author) {
          return;
        }

        tempPost.replyTo[0].author = author.data;
      }
      setPost(tempPost);
      setLikes(post.likes.length);
      setLiked(post.likes.some((e) => e.id === user.id));
      setLoading(false);
    }
  }, []);

  console.log(formatDate(post.createdAt));

  const likePost = () => {
    axios
      .post("/api/community/like_post", {
        userId: user.id,
        postId: post.id,
      })
      .then((data) => {
        console.log(data);
      })
      .then((data) => {
        setLiked(true);
        setLikes(likes + 1);
      });
  };

  const unlikePost = () => {
    axios
      .post("/api/community/unlike_post", {
        userId: user.id,
        postId: post.id,
      })
      .then((data) => {
        console.log(data);
      })
      .then((data) => {
        setLiked(false);
        setLikes(likes - 1);
      });
  };

  if (!loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ width: "100%" }}
        >
          <Link
            href={`/${
              post.replyTo[0]
                ? post.replyTo[0].author.username
                : post.author.username
            }/${post.replyTo[0] ? post.replyTo[0].id : post.id}`}
          >
            <a style={{ width: "100%" }}>
              <FeedPostContainer>
                <FeedPostWrapper>
                  <Link href={`/${post.author.username}`} passHref>
                    <a>
                      <Avatar user={post.author} size={48} hoverAction />
                    </a>
                  </Link>
                  <FeedContentWrap>
                    <FeedPostInfoWrap>
                      <PostAuthor>{post.author.name}</PostAuthor>
                      <PostUsername>{`@${post.author.username} · ${time}`}</PostUsername>
                    </FeedPostInfoWrap>
                    {post.replyTo ? (
                      post.replyTo.length > 0 ? (
                        <ReplyTo>
                          replying to{" "}
                          <span style={{ color: "blue" }}>
                            @{post.replyTo[0].author.username}
                          </span>
                        </ReplyTo>
                      ) : null
                    ) : null}
                    <Content>{post.body}</Content>
                    <ActionBarContainer>
                      <ClickContentContainer hoverColor="#00E0FF">
                        <Icon hoverColor="#00E0FF">
                          <HiOutlineChat size={24} color="#00000080" />
                        </Icon>
                      </ClickContentContainer>

                      <ClickContentContainer hoverColor="#FF00E5">
                        <Icon
                          hoverColor="#FF00E5"
                          liked={liked}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!liked) {
                              likePost();
                            } else {
                              unlikePost();
                            }
                          }}
                        >
                          <HiOutlineHeart
                            size={24}
                            color="#00000080"
                            liked={liked}
                          />
                        </Icon>
                        <Data>{likes}</Data>
                      </ClickContentContainer>

                      <ClickContentContainer hoverColor="#00FF38">
                        <Icon hoverColor="#00FF38">
                          <HiOutlineShare size={24} color="#00000080" />
                        </Icon>
                      </ClickContentContainer>
                    </ActionBarContainer>
                  </FeedContentWrap>
                </FeedPostWrapper>
              </FeedPostContainer>
            </a>
          </Link>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    return null;
  }
};

export default FeedPost;