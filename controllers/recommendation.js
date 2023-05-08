const { Recommendation, Points } = require("../models");
const { response } = require("express");
const { ObjectId } = require("mongodb");
const { resolveContent } = require("nodemailer/lib/shared");

const getAllRecommendation = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, recommendation] = await Promise.all([
      Recommendation.countDocuments(query),
      Recommendation.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate("clientId"),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        recommendation,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const getAllRecommendationByClient = async (req, res = response) => {
  try {
    const { id } = req.params;
    const recommendation = await Recommendation.find({
      state: true,
      clientId: id,
    }).populate("recommendedUser", ["name", "lastName", "avatar"]);

    const data = await Promise.all(
      recommendation.map(async (rec) => {
        const points = await Points.aggregate([
          {
            $match: {
              state: true,
              clientId: new ObjectId(rec.recommendedClient),
            },
          },
          {
            $group: {
              _id: {
                clientId: "$clientId",
              },
              totalPoints: {
                $sum: "$points",
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalPoints: 1,
            },
          },
        ]);

        return  {
          ...rec._doc,
          points: points[0]?.totalPoints || 0,
        };
      })
    );

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        recommendation: data,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};
const postRecommendation = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const recommendation = new Recommendation(data);

    // Guardar DB
    await recommendation.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        points,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};
const putRecommendation = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const recommendation = await Recommendation.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        recommendation,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};
const deleteRecommendation = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Recommendation.findByIdAndUpdate(id, { state: false }, { new: true });

    res.status(200).json({
      ok: true,
      status: 200,
      msg: "Puntos borrados",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

module.exports = {
  getAllRecommendation,
  getAllRecommendationByClient,
  postRecommendation,
  postRecommendation,
  deleteRecommendation,
};
