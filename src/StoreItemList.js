import React, { useState } from 'react';
import {
  useRecoilValue,
  useRecoilState
} from 'recoil';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import searchTextState from './searchTextState';
import searchTypeState from './searchTypeState';
import itemsVisibleState from './itemsVisibleState';
import itemsState from './itemsState';
import { SearchFormRow, Label } from './StoreSearch';

const CommentFormContainer = styled.div`
  margin: 15px 0;
`;

const SectionTitle = styled.div`
  background-color: #6bd46b;
  padding: 10px;
  font-weight: bold;
`;

const CommentsSongLine = styled.div`
  padding: 10px;
`;

const CommentBox = styled.div`
  padding: 8px;
`;


const searchItem = (e, searchText, searchType, setItems, setResultsToDisplay, setSearchText, setComments, setItemsVisible) => {
  e.preventDefault();

  if (searchText.trim() === "") {
    alert("Please enter what you want to search for");
    setSearchText("");
    return false;
  }

  setItems([]);
  setResultsToDisplay([]);
  setComments([]);

  fetch('https://itunes.apple.com/search?term=' + searchText + "&entity=" + searchType + "&limit=200")
    .then(response => response.json())
    .then(response => {
      setItems(response['results']);
      if (response['results'].length > 0) {
        setResultsToDisplay(response['results'].slice(0, 10));
      }
    })
    .catch(error => console.log(' Error ' + error));

  setSearchText('');
  setItemsVisible(true);
}

const searchViews = (e, collectionName, setComments) => {
  e.preventDefault();

  setComments([]);

  fetch('http://localhost:3001/api/albums/views?collectionName=' + collectionName)
    .then(response => response.json())
    .then(response => {
      setComments(response);

      if (response.length === 0) {
        alert("Add the first comment !");
      }
    })
    .catch(error => console.log(' Error ' + error));

}

const addView = (e, collectionName, newComment, setNewComment, setCommentCollectionName, setComments) => {
  e.preventDefault();

  fetch('http://localhost:3001/api/albums/add?collectionName=' + collectionName + '&newComment=' + newComment)
    .then(response => response.json())
    .then(response => {
      searchViews(e, collectionName, setComments);
      alert("Comment has been recorded");
    })
    .catch(error => console.log(' Error ' + error));

  setNewComment('');
  setCommentCollectionName('');

}

const updateView = (e, collectionName, oldComment, newComment, liked, setNewComment, setCommentCollectionName, setComments) => {
  e.preventDefault();

  fetch('http://localhost:3001/api/albums/update?collectionName=' + collectionName + '&newComment=' + newComment + '&oldComment=' + oldComment + '&liked=' + liked)
    .then(response => response.json())
    .then(response => {
      searchViews(e, collectionName, setComments);
      alert("Comment has been updated");
    })
    .catch(error => console.log(' Error ' + error));

  setNewComment('');
  setCommentCollectionName('');

}

const likeUnlike = (e, collectionName, comment, liked, setComments) => {
  e.preventDefault();

  const newLiked = liked === "0" ? "1" : "0";

  fetch('http://localhost:3001/api/albums/toggleLike?collectionName=' + collectionName + '&comment=' + comment + '&liked=' + newLiked)
    .then(response => response.json())
    .then(response => {
      searchViews(e, collectionName, setComments);
      alert("Comment has been updated");
    })
    .catch(error => console.log(' Error ' + error));

}


function StoreItemList() {

  const [pageToDisplay, setPageToDisplay] = useState(1);
  const [resultsToDisplay, setResultsToDisplay] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentCollectionName, setCommentCollectionName] = useState('');

  const [items, setItems] = useRecoilState(itemsState);
  const [searchText, setSearchText] = useRecoilState(searchTextState);
  const [itemsVisible, setItemsVisible] = useRecoilState(itemsVisibleState);

  const searchType = useRecoilValue(searchTypeState);

  const onNewCommentTextChange = (event) => {
    setNewComment(event.target.value);
  };


  const onCommentCollectionNameTextChange = (event) => {
    setCommentCollectionName(event.target.value);
  };

  return (
    <div>
      <SearchFormRow>
        <Label>
          Search :
        </Label>
        <button onClick={e => searchItem(e, searchText, searchType, setItems, setResultsToDisplay, setSearchText, setComments, setItemsVisible)} >Search</button>
      </SearchFormRow>

      { itemsVisible &&
        <div>
          <CommentFormContainer>
            <SearchFormRow>
              <Label>Album : </Label>
              <input type="text" value={commentCollectionName} onChange={onCommentCollectionNameTextChange} />
            </SearchFormRow>
            <SearchFormRow>
              <Label>Comment : </Label>
              <input type="text" value={newComment} onChange={onNewCommentTextChange} />
            </SearchFormRow>
            <SearchFormRow>
              {
                searchType === 'album' &&
                <>
                  <Label>Action : </Label>
                  <button onClick={e => addView(e, commentCollectionName, newComment, setNewComment, setCommentCollectionName, setComments)}>Add New Comment</button>
                </>
              }
            </SearchFormRow>
          </CommentFormContainer>
          {
            comments.length > 0 &&
            <>
            <SectionTitle>Comments</SectionTitle>
              <CommentsSongLine>Comment(s) for <strong>{comments[0].collectionName}</strong></CommentsSongLine>
              {comments.map((data, i) => {
                return (
                  <CommentBox key={i} >
                    <SearchFormRow>
                      <Label>Comment :</Label>
                      <span>{data.comment}</span>
                    </SearchFormRow>
                    <SearchFormRow>
                      <Label>Liked :</Label>
                      {<input type="checkbox" checked={data.liked === "1"} onClick={e => likeUnlike(e, data.collectionName, data.comment, data.liked, setComments)} />}
                      </SearchFormRow>
                    <SearchFormRow><button onClick={e => updateView(e, data.collectionName, data.comment, newComment, data.liked, setNewComment, setCommentCollectionName, setComments)}>Update Comment</button></SearchFormRow>
                  </CommentBox>
                )
              })}
            </>
          }

          <div>
            <div>
              {
                items != null && items.length > 0 &&
                <SectionTitle>Records</SectionTitle>
              }

              <InfiniteScroll
                dataLength={resultsToDisplay.length}
                next={() => {
                  setResultsToDisplay(items.slice(0, (pageToDisplay + 1) * 10));
                  setPageToDisplay(pageToDisplay + 1);
                }
                }
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                hasMore={true}
                loader={<h4>No record found...</h4>}
                scrollableTarget="scrollableDiv"
              >
                {resultsToDisplay.map((data, i) => {
                  return (
                    <CommentBox key={i} >
                      {
                        searchType === 'album' &&
                        <SearchFormRow>
                          <Label>Album name :</Label>
                          <span>{data.collectionName}</span>
                        </SearchFormRow>
                      }
                      <SearchFormRow>
                        <Label>Artist :</Label>
                        <span>{data.artistName}</span>
                      </SearchFormRow>
                      <SearchFormRow>
                        <Label>Genre :</Label>
                        <span>{data.primaryGenreName}</span>
                      </SearchFormRow>
                      {
                        searchType === 'album' && data.collectionName &&
                        <SearchFormRow>
                          <button onClick={e => searchViews(e, data.collectionName, setComments)}>View Comments</button>
                        </SearchFormRow>
                      }
                    </CommentBox>
                  )
                })}
              </InfiniteScroll>
            </div>
          </div>
        </div>

      }

    </div>
  );
}

export default StoreItemList;