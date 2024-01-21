import React from "react";
import "./orderview.css";
import { IoMdDownload } from "react-icons/io";
import Chat from "../../../components/chat/Chat";
import { useParams } from "react-router-dom";
import { useOrderContext } from "../../../providers/OrderProvider";
import { timeAgo } from "../../../../utils/helpers/TimeAgo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import OrderSkeletonLoading from "../../loading/OrderSkeletonLoading";
import { useAuthContext } from "../../../providers/AuthProvider";
import { checkDeadline } from "../../../../utils/helpers/DeadlineFormat";
import { formatDeadline } from "../../../../utils/helpers/DeadlineFormat";
import { useBiddingModal } from "../../BiddingModal/biddingModal";
import { useUpdateModal } from "../../BiddingModal/UpdateModal";
import { useDeleteModal } from "../../BiddingModal/DeleteModal";

const OrderView = () => {
  const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`;

  const { userToken, loadedUserProfile } = useAuthContext();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const iconSize = 17;

  const { orderId } = useParams();

  const { loadingAttachemnt, uploadAttachment } = useOrderContext();

  const [orderContent, setOrderContent] = useState();

  const [loading, setLoading] = useState(true);

  const uploadedAt = timeAgo(orderContent?.solution?.created);

  const [solutionType, setSolutionType] = useState("Draft");

  const deadline = formatDeadline(orderContent?.deadline);

  const deadlinePassed = checkDeadline(orderContent?.deadline);

  const [selectedFileName, setSelectedFileName] = useState("");

  const { BiddingModal, setShowBiddingModal } = useBiddingModal(orderContent);
  const { UpdateModal, setShowUpdateModal } = useUpdateModal();
  const { DeleteModal, setShowDeleteModal } = useDeleteModal();

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setSelectedFileName(selectedFile.name);
    }
  };
  const openFileDialog = () => {
    console.log("Opening file dialog");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadAttachmentFile = () => {
    const attachment = fileInputRef.current.files[0];

    if (attachment) {
      if (attachment.size <= 20 * 1024 * 1024) {
        uploadAttachment(attachment, orderId, solutionType).then((res) => {
          const attachmentUrl = res?.solution;

          const updatedOrder = {
            ...orderContent,
            solution: attachmentUrl,
          };

          orderContent.solution = attachmentUrl;

          setOrderContent(updatedOrder);
        });
      } else {
        console.log("Select a lower size file");
      }
    } else {
      console.log("Select a correct file format");
    }
  };

  const downloadFile = () => {
    const link = document.getElementById("solution-file");
    link.download = (orderContent?.solution.solution).substring(
      orderContent?.solution.solution.lastIndexOf("/") + 1
    );
    link.click();
  };

  const getOrder = async (orderId) => {
    try {
      const getOrderById = await fetch(`${ordersUrl}${orderId}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (getOrderById.ok) {
        const orderDetails = await getOrderById.json();
        setOrderContent(orderDetails);
      } else {
        const status = getOrderById.status;
        if (status === 401) {
          navigate(`/login?order=${orderId}`);
        }
      }
      // return orderDetails;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Getting order.....");
    getOrder(orderId);
  }, [orderId]);

  const myBid = orderContent?.bidders.some(
    (bid) => bid.freelancer.user.username === loadedUserProfile?.username
  );

  return (
    <div className="order-view">
      {orderContent?.status === "Available" && (
        <>
          <BiddingModal order={orderContent} />
          <UpdateModal />
          <DeleteModal />
        </>
      )}
      {loading ? (
        <OrderSkeletonLoading />
      ) : (
        orderContent && (
          <>
            <div className="order-details">
              <strong style={{ fontWeight: "bold" }}>
                {orderContent?.title}
              </strong>
              <div className="order-elements">
                <article>{orderContent?.category}</article>
                <strong>{!loading && "$" + orderContent?.amount}</strong>
                {orderContent?.status === "Available" && (
                  <>
                    {myBid ? (
                      <>
                        <a
                          onClick={() => setShowUpdateModal(true)}
                          className="inline-block px-3 py-2 text-sm rounded-3xl font-medium text-white bg-sky-400 border border-sky-400 active:text-sky-400 hover:text-white cursor-pointer focus:outline-none focus:ring"
                        >
                          Edit Bid
                        </a>
                        <a
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-block px-3 py-2 text-sm rounded-3xl font-medium text-white bg-red-400 border border-red-400 active:text-sky-400 hover:text-white cursor-pointer focus:outline-none focus:ring"
                        >
                          Cancel bid
                        </a>
                      </>
                    ) : (
                      <a
                        onClick={() => setShowBiddingModal(true)}
                        className="inline-block px-3 py-2 text-sm rounded-3xl font-medium text-white bg-sky-400 border border-sky-400 active:text-sky-400 hover:text-white cursor-pointer focus:outline-none focus:ring"
                      >
                        Place bid
                      </a>
                    )}
                  </>
                )}
                {orderContent?.status != "Available" && (
                  <article className="status">{orderContent?.status}</article>
                )}
              </div>
              <h2 className="card-jobtitle">
                by{" "}
                <a href="">
                  <span>{orderContent.client.user.username}</span>
                </a>{" "}
                <span className="inline-flex ml-4">
                  {orderContent?.status != "Completed" && (
                    <div>
                      {deadlinePassed && (
                        <article
                          style={{
                            color: "red",
                          }}
                        >
                          {deadline}
                          <span className="ml-2">overdue</span>
                        </article>
                      )}
                      {!deadlinePassed && (
                        <article style={{ color: "green" }}>
                          {deadline} Remain
                        </article>
                      )}
                    </div>
                  )}
                </span>
              </h2>
              {(orderContent.status === "Completed" ||
                orderContent.status === "In Progress") && (
                <div className="order-soln">
                  {orderContent?.solution && loadingAttachemnt ? (
                    <div className="animate-pulse"></div>
                  ) : (
                    <div className="solution">
                      <strong>
                        {orderContent?.solution ? "Solutions" : "Solutions"}
                        {orderContent?.status === "In Progress" && (
                          <>
                            <input
                              onChange={uploadAttachmentFile}
                              ref={fileInputRef}
                              className="hidden"
                              size={20 * 1024 * 1024}
                              type="file"
                              name=""
                              id=""
                            />
                          </>
                        )}
                      </strong>
                    </div>
                  )}

                  {!orderContent?.solution &&
                    orderContent?.status === "In Progress" && (
                      <div className="upload-div">
                        <span
                          onClick={openFileDialog}
                          className="block w-full cursor-pointer  h-auto  border border-sky-300 border-dashed bg-white px-3 py-2 text-sm transition  focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 "
                        >
                          <p className="text-center justify-center align-middle flex mt-1 text-sky-400">
                            {" "}
                            {selectedFileName
                              ? selectedFileName
                              : "Upload solution"}
                          </p>
                          <input
                            onChange={(e) => {
                              setSolutionType("Draft");
                              handleFileInputChange(e);
                            }}
                            ref={fileInputRef}
                            className="hidden"
                            size={20 * 1024 * 1024}
                            type="file"
                            name=""
                            id="photobutton"
                          />
                        </span>

                        <div className="">
                          <span className="text-sm text-gray-500">
                            solution type:
                          </span>
                          <select
                            onChange={(e) => setSolutionType(e.target.value)}
                            value={solutionType}
                            className="h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-400 text-sky-400 rounded py-0 md:py-1 tracking-wider"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Final">Final</option>
                          </select>
                        </div>

                        <button
                          onClick={uploadAttachmentFile}
                          className="inline-block px-12 py-3 text-sm font-medium text-white bg-sky-400 border border-sky-400 rounded active:text-sky-400 hover:text-white cursor-pointer focus:outline-none focus:ring"
                        >
                          Submit
                        </button>
                      </div>
                    )}

                  {orderContent?.solution && (
                    <div className=" ">
                      <a
                        href={orderContent?.solution?.solution}
                        id="solution-file"
                        rel="noopener noreferrer"
                        download
                        className="block rounded-lg p-4 shadow-sm bg-white"
                      >
                        {typeof orderContent?.solution?.solution === "string"
                          ? orderContent?.solution?.solution.substring(
                              orderContent?.solution?.solution.lastIndexOf(
                                "/"
                              ) + 1
                            )
                          : ""}
                      </a>
                      <div className="mt-2">
                        <dl>
                          <div>
                            <dd className="text-sm text-gray-500">
                              <span className="mr-2">Solutiion type :</span>
                              {orderContent?.solution?._type}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <IoMdDownload
                        onClick={downloadFile}
                        className="cursor-pointer"
                        size={iconSize}
                      />
                      <span className="text-gray-500 ">{uploadedAt}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="instructions">
                <strong>
                  {orderContent?.status === "In Progress" ||
                  orderContent?.status === "Available"
                    ? orderContent?.instructions
                      ? "Instructions"
                      : "No instructions available at the moment."
                    : orderContent?.status === "Completed" && "Instructions"}
                </strong>
                {orderContent?.instructions && (
                  <div>
                    <article>{orderContent?.instructions}</article>
                  </div>
                )}
              </div>
              {orderContent?.status === "Completed" &&
              !orderContent?.attachment ? null : (
                <div className="attachments">
                  {orderContent?.attachment && loadingAttachemnt ? (
                    <div style={{ height: "1.5rem" }}></div>
                  ) : (
                    <strong style={{ height: "1.5rem" }}>
                      {orderContent?.attachment ? "Attachments" : "Attachments"}
                      {orderContent?.status === "In Progress"}
                    </strong>
                  )}
                  {!orderContent?.attachment &&
                    (orderContent?.status === "In Progress" ||
                      orderContent?.status === "Available") && (
                      <div className="upload-div">
                        <article onClick={openFileDialog}>
                          No Attachments available at the moment.
                        </article>
                      </div>
                    )}
                  {orderContent?.attachment && (
                    <div>
                      <a
                        href={orderContent?.attachment}
                        target="_blank"
                        download
                      >
                        {orderContent?.attachment.substring(
                          orderContent?.attachment.lastIndexOf("/") + 1
                        )}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Chat
              orderId={orderId}
              client={orderContent.client}
              freelancer={orderContent.freelancer}
            />
          </>
        )
      )}
    </div>
  );
};

export default OrderView;
